---
title: "Encrypted Chat Over Sound: An Acoustic MFSK Modem in Rust"
author: Dendi Suhubdy
pubDatetime: 2026-08-30T05:30:00Z
featured: false
draft: false
tags:
  - signal-processing
  - cryptography
  - rust
  - modems
  - acoustics
  - systems
description: "I wrote a program that sends encrypted chat between two laptops using nothing but a speaker and a microphone. No network, no pairing, no passphrase — the peers agree a key over the air with X25519 and you verify it by reading four words aloud. Here is the whole stack: parallel MFSK modulation, Goertzel detection, Reed–Solomon with cross-block interleaving, half-duplex carrier sense, and AES-256-GCM with a short authentication string."
---

Two laptops sit on a desk. There is no Wi-Fi, no Bluetooth pairing, no cable, no shared account, and nothing agreed in advance. One of them plays a short burst of tones out of its speaker. The other hears it through its microphone and prints a sentence.

That is [**tranceiver**](https://github.com/dendisuhubdy/audio-modem-transceiver), a program I wrote over the last few weeks. It is encrypted chat where the only link layer is sound: your line of text is sealed with AES-256-GCM, wrapped in Reed–Solomon, and played as audio. Another copy of the program, listening on a microphone, recovers it.

It is about 2,700 lines of Rust, GPL-3.0, and it does the whole stack — modulation, framing, synchronisation, forward error correction, key agreement, authenticated encryption — over a channel you can literally hear.

This post is about why that channel is interesting and how each layer works.

---

## Why send data as sound?

Sound is the medium of last resort, and that is exactly what makes it worth understanding. It needs no network, no pairing, no line of sight, and no shared infrastructure — only a speaker on one side and a microphone on the other, which is hardware nearly every device already has. Where radio is blocked, absent, forbidden, or simply not agreed upon in advance, a pressure wave still gets through.

### Underwater, radio simply does not go

Seawater is a conductor, so radio dies in it. The skin depth is roughly **6 cm at 20 MHz** — a Wi-Fi or GPS signal is gone before it clears a diver's mask. Very low frequency radio (3–30 kHz) penetrates about **20 m**, enough to reach a shallow submarine, but the band is so narrow it carries little more than slow text, and transmitting it takes antennas measured in kilometres.

Sound has the opposite problem set. It travels at about **1500 m/s** in seawater and stays intelligible over **kilometres**. So essentially all underwater telemetry is acoustic: autonomous underwater vehicles, seafloor sensor networks, diver recall, submarine-to-ship signalling, offshore blowout preventer control.

NATO standardised this. **JANUS** (STANAG 4748, promulgated 24 March 2017) was the first internationally adopted digital underwater communications protocol. Its baseline is frequency-hopped binary FSK centred at **11520 Hz**, occupying 9440–13600 Hz, carrying **80 bits per second**.

Eighty bits per second. That is slower than a 1960s telephone modem, and it is the *standard*, because the channel is that hostile: multipath from surface and seabed bounces, Doppler from moving platforms, and a propagation delay a million times worse than radio.

If those numbers look familiar by the end of this post, they should. This program lives in the same design space one medium up.

### Where else sound earns its place

| Domain | What sound does there |
| --- | --- |
| **Downhole drilling** | Mud pulse telemetry sends data up the borehole as pressure waves in drilling fluid at **1–10 bps**; acoustic telemetry along the drill string reaches 50–100 bps in the 400 Hz–2 kHz band. There is no cable to the drill bit. |
| **Through-metal links** | Ultrasonic transducers move data and power through the wall of a sealed pressure vessel or submarine hull without drilling a hole through it — which would be the part that fails. |
| **Weak-signal radio** | Amateur modes like **FT8** feed audio into an ordinary radio: 8-FSK, LDPC(174,91), 77-bit messages in 15-second slots, decodable at about **−20 dB SNR**. Contacts get made on signals far below what an ear can hear. |
| **Proximity transfer** | **Chirp**, a data-over-sound company, was acquired by **Sonos in January 2020** for device provisioning in RF-restricted environments. Google's **Tez** wallet in India moved money phone-to-phone with ultrasonic "Audio QR" — no NFC, no network. |
| **Air-gap security** | Sound crosses air gaps, which cuts both ways. Mordechai Guri's group has exfiltrated data from network-isolated machines using fan noise (**Fansmitter**), hard-drive arm noise (**DiskFiltration**), and speaker-to-speaker ultrasound (**MOSQUITO**). This is why secure facilities remove speakers and microphones, not just network cards. |
| **Cross-device tracking** | The same physics has been used against people. **SilverPush** embedded inaudible beacons in TV ads so phones could silently link a viewer to their handset; the **FTC warned developers in March 2016**. Worth knowing about, and worth not building. |

### What the medium is actually like

| | Sound in air | Sound in seawater | Radio |
| --- | --- | --- | --- |
| Propagation speed | ~343 m/s | ~1500 m/s | ~3 × 10⁸ m/s |
| Typical data rate | tens of bytes/s | tens of bps to a few kbps | Mbit/s and up |
| Practical range | a room | kilometres | kilometres |
| Works underwater | — | yes | no |
| Needs prior pairing | no | no | usually |
| Hardware required | any speaker and mic | transducer | radio |

Sound is slow, short-range, audible, and shared with every other noise in the room. In exchange it is universal, needs no permission, and reaches every device within earshot at once — one transmission, any number of receivers, no addressing.

---

## What using it looks like

One binary, both roles, decided automatically. It listens on the microphone by default and becomes a transmitter only for as long as it takes to put your message on the air, then goes back to listening. There is no mode to choose and no flag to flip.

```bash
# On the first machine
tranceiver --name alice

# On the second machine
tranceiver --name bob
```

Within a few seconds each side announces the pairing:

```console
── paired with bob ──
   verify code: amber cliff otter storm
   read it aloud; if your peer sees different words, someone is in the middle
```

Then you type, and it goes out over the air. A status indicator to the left of the cursor says what the link is doing — `[listening]`, `[receiving]`, `[queued 2]`, `[sending 2.4s]` — because on a channel this slow, "did it go?" is a question you will actually have.

Note what is *not* in those commands: no passphrase. On startup the two peers run an X25519 key exchange over the acoustic link itself. I will come back to why that is safe, and to the four words.

---

## The modem

### Modulation: parallel MFSK

Each frame carries 16 bits as four simultaneous tones. The frame's two bytes split into four nibbles, and nibble *g* selects one of 16 frequencies from group *g*'s private band. Four groups sound at once.

- Frame rate: **23.4375 Hz** (42.67 ms per frame, which is 48000/2048)
- Data band: **1500 – 5930 Hz**, tones spaced 70.3 Hz
- Carrier-detect tone: **1289 Hz**, parked below the data band
- Raw channel rate: 2 bytes × 23.4375 = **46.9 bytes/s**

A 100-character message takes about 4.5 seconds on the air. That is the deal you accept when your link layer is a laptop speaker.

The tone spacing is not arbitrary. Every tone frequency is an exact integer multiple of the frame rate — 70.3 Hz is exactly 3 × 23.4375. That means each tone lands precisely on a DFT bin centre of the analysis window **at any sample rate**, so orthogonality between tones is exact rather than approximate, and the two machines do not have to agree on a sample rate at all. One can run at 44.1 kHz and the other at 48 kHz.

Two details keep the spectrum clean. Tones maintain continuous phase across frames — each tone is a slice of one long sinusoid rather than a fresh oscillator started at phase zero — and every frame gets a 1 ms raised-cosine taper at each edge. Without those, switching tone sets 23 times a second splatters broadband clicks across the whole band, which is exactly the energy your neighbouring tones do not need.

### Detection: Goertzel, not FFT

The receiver does not compute a spectrum. It evaluates the DFT at 65 known frequencies — 64 data tones plus the sync tone — using the Goertzel algorithm, which computes a single DFT bin with a two-tap recurrence and no complex arithmetic in the loop.

This is the right call for a specific reason. The tone grid is defined in *absolute Hz*. An FFT gives you bins at multiples of `fs/N`, and if CoreAudio hands you a sample rate you did not plan for, your tones fall between bins and you are resampling or interpolating. A Goertzel probes the exact frequency you ask for, whatever the sample rate. Sixty-five Goertzels per frame is also simply cheaper than an FFT you would then throw 97% of away.

### The packet

```
[ 8 frames ] pure sync tone   carrier detect + coarse timing
[ 1 frame  ] silence          edge marker
[ 2 frames ] sync word        fine timing + false-alarm rejection
[ 6 frames ] header           RS(12,4), carries the body length
[ n frames ] body             RS(k+32,k) + cross-block interleave
[ 1 frame  ] silence          tail
```

Acquisition is two-stage. A short-window energy detector finds the sync tone and, more usefully, its *falling edge* into the silence frame — an edge localises a packet far better than a level does. A coarse-then-fine search over the two known sync symbols then pins the frame boundary to within a few samples. After that, frames are read at a fixed stride: two independent sound cards drift by well under a sample per second, which is nothing over a message that lasts four.

The eight-frame preamble is not politeness. It is what makes carrier sense fast enough to be useful — more on that shortly.

### Error correction, and the trick that matters

The header gets its own RS(12,4) codeword, heavily over-protected, because the body length has to be recovered before anything else can even be sized. Four data bytes, eight parity bytes; it survives four corrupted bytes out of twelve.

The body is split into RS(k+32, k) blocks — 16 correctable byte errors each — and then **interleaved across blocks**: byte 0 of every block, then byte 1 of every block, and so on.

That interleave is the single highest-leverage line in the FEC layer, because of what acoustic errors actually look like. They are not independent coin flips. Someone closes a door, a chair scrapes, a fan spins up — and you lose a *run* of consecutive frames. A contiguous 60-byte burst would blow straight through one block's budget of 16 errors and the message is gone. Spread over four interleaved blocks, the same burst is 15 errors each, and every block decodes. There is a test in the repo that does exactly this.

On top of that, the demodulator reports its own uncertainty. For each group it compares the strongest tone against the runner-up; when the ratio is poor, that nibble is flagged as an **erasure** — an error whose *location* is known even though its value is not. Reed–Solomon corrects erasures at half the cost of unknown errors, so a flagged byte is twice as cheap to fix. Declaring 24 erasures gets you past the 16-error limit that the same corruption would otherwise hit. If the erasure-assisted decode fails, it retries errors-only.

That is the general principle worth taking away: a demodulator that admits what it is unsure about is worth more to the decoder than one that guesses confidently.

### Taking turns

The channel is half duplex — one speaker, one room, one message at a time. So the transmitter is gated. A typed message goes into an outbound queue and leaves it only when three things hold:

1. the demodulator reports no carrier and no packet in progress,
2. the channel has been quiet for 250 ms, and
3. a per-turn random backoff of up to 350 ms has elapsed.

If that looks like CSMA, it is. The backoff is what stops two peers that were both blocked from starting in the same instant when the channel clears. Our own transmission counts as the channel being occupied, so consecutive queued messages space themselves out too, leaving the other side room to answer.

Carrier sense keys off the preamble tone, which is detected within about **30 ms** of a peer starting to transmit — well before their data frames begin. The remaining race, where both sides start inside that 30 ms window, produces a collision that the CRC and the AEAD tag reject. Those messages are simply not delivered, and you retype them. On a link this slow, an acknowledgement-and-retransmit scheme would cost more than it saves.

---

## The crypto

### Agreeing a key over the air

The default has no passphrase at all. Each run generates an ephemeral **X25519** keypair and broadcasts the public half in a HELLO packet. A peer that hears an opening HELLO derives the shared secret and answers with its own, flagged as a reply so the exchange terminates at two packets. Both sides feed the shared secret through HKDF-SHA256, salted with the two public keys **in sorted order** — so neither side needs to know who started — and take 32 bytes of session key plus 24 bits of verify code.

HELLO rebroadcast timing is randomised (5–9 s, with a 0–2 s spread on the very first one). Two programs launched together would otherwise transmit simultaneously, before either could hear the other's carrier, and collide on every attempt — a lockstep livelock that is much easier to write than to debug.

Because the keys are ephemeral, this gives **forward secrecy**. A recording of today's conversation cannot be opened later, even by someone who takes both laptops, because the private keys never touched disk and are gone when the process exits.

### The four words are the whole security argument

Diffie–Hellman with no prior secret cannot distinguish your peer from someone in the room answering in their place. An attacker runs one handshake with you, another with your peer, and relays — the classic machine-in-the-middle. Nothing in the mathematics prevents it.

What the attacker *cannot* do is make both verify codes come out the same, because each of their two handshakes has a different transcript. Four words from a 64-word list is 24 bits, so a machine-in-the-middle gets one blind guess, in public, at a code two humans are about to read to each other.

This is the same **short authentication string** defence ZRTP and Signal use, and it fits this link unusually well: the entire premise of an acoustic channel is that both people are already within earshot. The out-of-band verification channel is *right there*. You are already in a position to just say the words.

Which is why the code is not optional, and why the program prints an instruction rather than a decoration.

### Sealing and replay

Messages are sealed with **AES-256-GCM**, a fresh random 96-bit nonce each, with the protocol version bound in as associated data so a packet from a different version can never authenticate. A chat body on the air is:

```
0x10 || nonce(12) || ciphertext || GCM tag(16) || CRC-16
```

and the sealed plaintext inside is `seq(4) || name_len(1) || name || text`. A 20-character message therefore costs 51 bytes on the air before coding. The type byte sits *outside* the encryption because the handshake has to be parseable before a session key exists.

That `seq` is a 32-bit counter that advances with every transmission, sealed inside the AEAD where it cannot be altered in flight. The receiver keeps the highest counter accepted per sender and drops anything that does not beat it. So a packet recorded off the air and played back authenticates, decrypts, and is *still* discarded:

```console
alice: transfer 100 dollars to eve
[dropped a replayed message from alice (counter 1)]
```

A strict must-increase rule suffices because this link cannot reorder: it is half duplex, one station transmits at a time, and the demodulator hands packets over in acquisition order. Losses only create gaps, which advancing counters absorb for free.

There is also a pre-shared passphrase mode (`--key`, PBKDF2-HMAC-SHA256 at 200,000 iterations), which is required for the one-directional and file modes since those cannot complete a handshake. It cannot be intercepted at all, at the cost of no forward secrecy and a fixed KDF salt — both sides must derive the same key from the passphrase alone, so there is nowhere to put a random one. Use a long passphrase.

### What it does not protect

Being explicit about this matters more than the feature list.

- **Under a pre-shared key, cross-session replay still works.** The key outlives the process, so a packet captured in an earlier run can be replayed as the first message of a new one — the receiver starts with an empty watermark and has no way to know better. Closing that needs persistent state or a challenge, neither of which is implemented. Under an exchanged key the problem does not arise: each run has a fresh key and an old recording cannot be decrypted at all.
- **Two parties.** The channel is a broadcast with no addressing, and a session key belongs to one pair. A third peer that handshakes replaces the session.
- **Traffic is not hidden.** The channel is a loudspeaker. Anyone in the room hears that you are transmitting and roughly how much, even if they cannot read it. There is no such thing as a covert transmission at 1.5–6 kHz across a desk.

---

## Does it work?

There is a `--selftest` that runs the entire chain in memory against additive white noise, with no audio hardware, at several SNRs and message sizes. Running it just now:

```console
$ tranceiver --selftest
  snr   20 dB  case 0 (  2 B)  ok
  ...
  snr    0 dB  case 3 (400 B)  ok
  snr   -3 dB  case 0 (  2 B)  ok
  snr   -3 dB  case 1 ( 43 B)  ok
  snr   -3 dB  case 2 ( 24 B)  ok
  snr   -3 dB  case 3 (400 B)  ok

100-character message takes 4.52s on the air
selftest passed
```

The sweep gate stops at −3 dB to keep margin as a regression test; the measured limit against broadband white noise is around **−6 dB**. Negative SNR means the noise is louder than the signal, which is what the combination of orthogonal tones, interleaved Reed–Solomon, and erasure flagging buys you.

Over the actual air, on a MacBook Air, speaker to its own microphone:

- Messages from 2 to 187 bytes received across a desk, with zero or one symbol flagged weak out of hundreds.
- Two full transceivers on one machine exchange messages in both directions; a peer that starts typing 0.6 s into the other's transmission defers and gets through afterwards — both delivered.
- Key exchange with no passphrase on either side completes in **about 6 seconds**, 4 runs out of 4, both sides deriving an identical verify code.
- A recorded transmission spliced onto itself and fed back through the demodulator is delivered **once**, duplicate reported and dropped. Against the previous commit it was delivered twice.
- Identical behaviour at 44.1 kHz and 48 kHz.

---

## Why I think this is worth building

The honest answer is that it makes an entire communications stack *visible*.

Every layer here exists in the Wi-Fi chipset three inches from where I am typing: modulation, preamble acquisition, carrier sense with randomised backoff, forward error correction with interleaving, key agreement, authenticated encryption, replay rejection. All of it, buried in silicon and firmware, running a hundred thousand times faster than this and utterly opaque.

Move the same stack onto a channel that runs at 47 bytes per second and emits audible tones, and it stops being an abstraction. When acquisition fails you can *listen* to why — you hear the door close over the preamble. When the interleaver saves a message you can identify the burst that would have killed it. The design pressures that produced JANUS at 80 bps, and FT8's LDPC at −20 dB, and Bell 103's 300 bps through a telephone handset in 1962, are the same pressures, only slow enough to watch.

And underneath the pedagogy there is a real property: two machines with no shared infrastructure, no prior secret, and no network can establish a forward-secret encrypted channel using hardware that ships in everything, verified by two people saying four words to each other. That is a strange and rather nice thing to be able to do.

The code is at [**github.com/dendisuhubdy/audio-modem-transceiver**](https://github.com/dendisuhubdy/audio-modem-transceiver), GPL-3.0-or-later. `cargo build --release`, then `--selftest` to prove the build before you start blaming the room.

---

## Further reading

- [The JANUS underwater communications standard](https://www.researchgate.net/publication/265594031_The_JANUS_underwater_communications_standard) — NATO STANAG 4748
- [The FT4 and FT8 communication protocols](https://wsjt.sourceforge.io/FT4_FT8_QEX.pdf) — weak-signal MFSK with LDPC coding
- [A review of communication technologies in mud pulse telemetry systems](https://doi.org/10.3390/electronics12183930)
- [MOSQUITO: covert ultrasonic transmissions between two air-gapped computers](https://arxiv.org/pdf/1803.03422)
- [Fansmitter: acoustic data exfiltration via fan noise](https://www.sciencedirect.com/science/article/abs/pii/S0167404820300080)
- [Sonos acquires data-over-sound pioneer Chirp](https://audioxpress.com/news/data-over-sound-pioneer-chirp-acquired-by-sonos)
- [Ultrasonic cross-device tracking and the FTC warnings](https://natlawreview.com/article/ultrasonic-cross-device-tracking-consumer-management-tool-ftc-warnings)
