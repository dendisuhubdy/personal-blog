---
title: "Navigating Blind: How Drones Fly Without GPS — and Why It Matters More Than Ever"
author: Dendi Suhubdy
pubDatetime: 2026-04-30T22:30:00Z
featured: false
draft: false
tags:
  - drones
  - robotics
  - navigation
  - gps-denied
  - slam
  - vio
  - computer-vision
  - autonomy
  - magnetic-navigation
  - ukraine
description: "GPS jamming and spoofing are now routine in contested airspace, and indoor/underground operations have always lived without it. This post is a technical survey of GPS-denied drone navigation in 2026 — VIO, visual SLAM, terrain-relative navigation, satellite image matching, magnetic anomaly navigation (MagNav), LiDAR SLAM, and multi-modal factor-graph fusion. Deep dives into satellite image matching (the most promising daytime approach) and MagNav (the dark horse that works at night, in fog, and is unjammable). With lessons from Ukraine, the open problems, and a practical stack for builders."
---

*1 May, 2026 — Second Edition*

GPS is the invisible scaffolding of modern drone autonomy. Strip it away and the entire navigation stack — mission planning, waypoint following, return-to-home, geofencing — collapses. The drone doesn't know where it is. It doesn't know where it's going. It cannot return.

This is not a theoretical concern. It is the daily reality of drone operations in contested airspace (Ukraine, the Eastern Mediterranean, the Red Sea corridor), inside buildings (warehouses, mines, disaster zones), under canopy (agriculture, forestry, search-and-rescue), and in urban canyons where multipath reflections make GPS unreliable even in peacetime. GPS jamming hardware that once required nation-state resources now costs less than the drone it disables.

The question is no longer *whether* drones need to navigate without GPS. The question is *how* — and the answer in 2026 is a layered stack of techniques, each with different failure modes, computational costs, and maturity levels. This post is a technical survey of what actually works, with deep dives into the two most promising approaches for absolute positioning without GPS: **satellite image matching** and **magnetic anomaly navigation**.

---

## Table of contents

---

## 1. Why GPS Fails

GPS signals arrive at the receiver at roughly −130 dBm — weaker than the thermal noise floor. The system works because the receiver knows the pseudorandom code and can correlate against it, pulling signal from noise. This also means GPS is trivially easy to overwhelm.

**Jamming** floods the GPS frequency bands (L1 at 1575.42 MHz, L2 at 1227.60 MHz) with noise, making correlation impossible. Effective range depends on jammer power, but commercial jammers with a few watts of output can deny GPS over hundreds of meters. Military-grade jammers (Russia's R-330Zh Zhitel, the Pole-21 system) deny GPS over tens of kilometers.

**Spoofing** is subtler and more dangerous. A spoofer transmits valid-looking GPS signals with false timing, causing the receiver to compute an incorrect position. The drone thinks it's on course while flying somewhere else entirely. Spoofing has been documented extensively in the Ukraine conflict and in the Eastern Mediterranean, where commercial aviation GPS has been disrupted over areas the size of small countries.

**Environmental denial** is equally common. GPS signals cannot penetrate:
- Building interiors (warehouses, factories, parking garages, mines)
- Dense forest canopy (attenuates signals by 10–20 dB)
- Urban canyons (multipath reflections cause position errors of 10–50 meters)
- Underground environments (tunnels, caves, subway systems)

The uncomfortable truth: GPS is a peacetime, outdoor, open-sky technology. Any serious drone application eventually encounters conditions where it doesn't work.

---

## 2. The Navigation Stack Without GPS

A GPS-equipped drone fuses three things: **global position** (GPS), **orientation** (IMU/magnetometer), and **velocity** (GPS Doppler or differentiated position). Remove GPS and you lose global position and velocity in one stroke. What remains is the IMU — accelerometers and gyroscopes — which provides orientation and relative motion but drifts without bound.

The challenge of GPS-denied navigation is replacing the global position and velocity signals with alternative sources, at sufficient accuracy and update rate to keep the flight controller stable. The standard taxonomy of replacements:

| Method | Provides | Drift? | Needs Prior Map? | Compute Cost | Works At Night? |
|--------|----------|--------|------------------|--------------|-----------------|
| INS (IMU alone) | Relative pose | Unbounded | No | Minimal | Yes |
| Visual Odometry | Relative pose + velocity | Bounded but grows | No | Moderate | No (needs light) |
| VIO | Relative pose + velocity | Slower drift | No | Moderate | No |
| Visual SLAM | Relative pose + loop closure | Bounded with revisits | No | High | No |
| Terrain-Relative Nav (TRN) | Global position | None (if map is accurate) | Yes | Moderate | Depends on sensor |
| Satellite Image Matching | Global position | None | Yes (satellite imagery) | High | Depends on sensor |
| LiDAR SLAM | Relative pose + map | Bounded with loop closure | No | High | Yes |
| Magnetic Navigation | Global position | None | Yes (magnetic map) | Low | Yes |
| Celestial Navigation | Global heading + latitude | None | No (needs star catalog) | Low | Night only |

No single method replaces GPS. Every serious GPS-denied system uses a combination.

---

## 3. Inertial Navigation: The Clock Is Ticking

An inertial navigation system (INS) double-integrates accelerometer measurements to get position and integrates gyroscope measurements to track orientation. The math is straightforward. The problem is error accumulation.

Consumer MEMS IMUs (the kind in a \$500 drone) have accelerometer biases on the order of 1–10 mg and gyroscope biases of 1–10 °/hr. After double integration, a 1 mg accelerometer bias produces ~0.5 meters of position error after 1 second, ~50 meters after 10 seconds, and ~5 kilometers after 100 seconds. This is why pure INS is useless for navigation beyond a few seconds without external corrections.

Tactical-grade IMUs (Honeywell HG1700, Northrop Grumman LN-200) reduce drift by 10–100×, giving useful navigation for minutes rather than seconds. Navigation-grade IMUs (ring laser gyros, fiber optic gyros) can maintain accuracy for hours but cost \$50,000–\$500,000 and weigh kilograms — impractical for most drones.

**The role of the IMU in GPS-denied flight** is not standalone navigation. It is the high-rate (200–1000 Hz) backbone that other, slower sensors correct against. Every GPS-denied architecture is fundamentally an IMU with external aiding sources.

---

## 4. Visual Odometry and VIO

**Visual Odometry (VO)** estimates the camera's motion by tracking features across sequential frames. Detect keypoints (corners, blobs) in frame *t*, match them in frame *t+1*, compute the essential matrix or use PnP to recover the relative pose. Concatenate these relative poses and you get a trajectory.

The problem: VO drifts. Every frame-to-frame estimate has a small error — typically 0.1–2% of distance traveled — and these errors accumulate monotonically. After 1 km of flight, a 1% drift means you're 10 meters off. After 10 km, 100 meters.

**Visual-Inertial Odometry (VIO)** fuses camera and IMU measurements in a tightly coupled estimator (typically an Extended Kalman Filter or a sliding-window optimization like MSCKF). The IMU provides high-rate motion priors between visual observations; the camera provides scale and corrects IMU drift. The result is substantially lower drift than either sensor alone.

State-of-the-art VIO systems in 2026:

- **VINS-Mono / VINS-Fusion** (Qin et al., HKUST) — the open-source workhorse. Tightly coupled, sliding window optimization, loop closure optional. Widely used in PX4/ArduPilot integrations.
- **OKVIS2** (Leutenegger et al.) — keyframe-based, full bundle adjustment, highly accurate but compute-heavy.
- **Basalt** (Usenko et al., TUM) — square-root marginalization, among the most efficient and accurate open-source options.
- **NVIDIA Isaac ROS Visual SLAM** — GPU-accelerated VIO designed for Jetson platforms, increasingly used on Orin Nano-equipped drones.

**Failure modes of VIO:**
- **Featureless environments**: white walls, snow, open water, fog. No features to track = no visual information.
- **Rapid motion / motion blur**: aggressive maneuvers break feature tracking.
- **Lighting changes**: entering/exiting buildings, flying toward the sun, flickering artificial light.
- **Scale ambiguity**: monocular VO cannot recover absolute scale without the IMU or a known reference.

VIO is the baseline of GPS-denied drone navigation. It is necessary but not sufficient for missions longer than a few hundred meters, because drift — even slow drift — eventually makes the drone lost.

---

## 5. Visual SLAM

Visual Simultaneous Localization and Mapping (VSLAM) extends VO/VIO by building a persistent map of the environment and recognizing when the drone returns to a previously visited location (**loop closure**). Loop closure corrects accumulated drift in one shot, snapping the trajectory back to consistency.

Key systems:

- **ORB-SLAM3** (Campos et al., 2021) — the reference implementation. Supports monocular, stereo, RGB-D, and visual-inertial modes. Map reuse across sessions. The most cited VSLAM system in the literature.
- **Kimera** (Rosinol et al., MIT) — real-time metric-semantic SLAM, builds 3D mesh with semantic labels. Useful for inspection and search-and-rescue.
- **RTAB-Map** — appearance-based loop closure, works with many sensor configurations, well-integrated with ROS.

**When SLAM shines**: indoor environments, repeated patrols, inspection missions where the drone revisits areas. Loop closure eliminates drift, and the persistent map enables re-localization if the drone is "kidnapped" (loses track of its position).

**When SLAM struggles**: long-range, one-way flights where the drone never revisits anywhere. Without loop closures, SLAM degrades to VIO with extra memory overhead. Also problematic in environments that change over time (construction sites, disaster zones, seasonal vegetation change).

The compute cost of maintaining a SLAM map is non-trivial. On a Jetson Orin Nano (~40 TOPS), ORB-SLAM3 with VIO runs at 20–30 fps in typical indoor environments but can drop in large-scale outdoor scenes. Map management (when to add keyframes, when to cull) is an engineering problem as much as a research one.

---

## 6. Terrain-Relative Navigation

Terrain-Relative Navigation (TRN) is the oldest GPS-alternative and remains one of the most robust. The concept: carry a stored map of the terrain (elevation, imagery, or both) and continuously match what the drone's downward-looking sensor sees against the stored map to determine global position.

**TERCOM (Terrain Contour Matching)** — used by Tomahawk cruise missiles since the 1980s. The drone carries a radar or laser altimeter and a stored digital elevation model (DEM). The sequence of altitude readings along the flight path is correlated against the DEM to determine position. Accuracy: 10–100 meters depending on terrain roughness. Works at night, in fog, and in any weather. Fails over flat terrain (ocean, desert, plains) where the elevation profile is featureless.

**DSMAC (Digital Scene-Matching Area Correlation)** — correlates a camera image of the terrain against stored reference imagery. More precise than TERCOM (sub-meter possible) but requires visual conditions and a prior reference image database. Also used on Tomahawk for terminal guidance.

**Modern approaches** combine these ideas with deep learning. Neural scene matching (trained on satellite imagery) can match a drone's camera view against a georeferenced image database even under significant viewpoint, lighting, and seasonal changes. Systems like OKSI's OMNInav and various DARPA-funded programs use learned feature matching against satellite imagery databases, supporting both visible and infrared cameras for day/night operation.

**The fundamental trade-off**: TRN gives you drift-free global position — the one thing VIO cannot — but requires carrying a prior map. For planned missions over mapped terrain, this is excellent. For exploration of unknown environments, it's useless.

---

## 7. Deep Dive: Satellite Image Matching — How a Drone Finds Itself on Earth

This is the approach with the most potential to replace GPS for planned outdoor missions, and it deserves a detailed technical explanation.

### The Core Idea

The drone carries a database of georeferenced satellite images in onboard memory. During flight, a downward-facing camera captures live images of the terrain below. A matching algorithm compares the live image against the stored satellite database and determines where on Earth the drone currently is. The output is a latitude/longitude fix — the same thing GPS provides, but derived entirely from vision.

Think of it this way: you're dropped blindfolded somewhere on Earth with a camera and a printed atlas of satellite photos. You remove the blindfold, take a photo of the ground below you, then flip through your atlas until you find the page that matches what you see. That page has coordinates printed on it. You now know where you are. The drone does this automatically, 1–5 times per second.

### Step 1: Building the Onboard Satellite Map Database

Before the mission, the operator defines the expected flight corridor — say, a 20 km route with a 2 km margin on each side. Satellite imagery covering this corridor is downloaded from a provider:

- **Commercial providers**: Maxar (30 cm/pixel), Planet Labs (3 m/pixel daily), Airbus Pléiades (50 cm/pixel)
- **Open sources**: Sentinel-2 (10 m/pixel, free), Google Earth imagery (varies, typically 0.5–15 m/pixel)
- **Military sources**: classified imagery at even higher resolutions

The imagery is **georeferenced** — every pixel has a known latitude and longitude. This is typically stored in GeoTIFF format, where the file header contains an affine transformation mapping pixel coordinates to geographic coordinates.

For a typical mission, the database is organized as a **tile grid**:

```
Mission Area: 20 km × 4 km = 80 km²
Satellite resolution: 0.5 m/pixel
Raw image size: 40,000 × 8,000 pixels ≈ 320 megapixels
Compressed (JPEG, quality 85): ~50–100 MB
With feature pre-extraction: +200–500 MB
Total onboard storage: ~300 MB – 1 GB
```

This easily fits in the flash storage or SD card of any modern companion computer. Even a Raspberry Pi has enough storage.

However, the raw satellite images are not stored alone. The system **pre-extracts features** from each tile and stores both the imagery and the feature descriptors. This is the key to real-time performance — feature extraction is expensive, so you do it once on the ground, not in flight.

### Step 2: Feature Extraction — What the System Looks For

Both the satellite tiles and the live drone images need to be represented as sets of **local features** — distinctive visual patterns that can be recognized across different viewpoints, lighting conditions, and seasons. The feature extraction pipeline has two parts:

**Keypoint detection** — finding "interesting" points in the image. These are typically corners, blobs, or edge junctions that are locally distinctive. Classical detectors: SIFT, SURF, ORB, FAST. Modern learned detectors: **SuperPoint** (DeTone et al., 2018), **ALIKED** (Zhao et al., 2023), **DISK** (Tyszkiewicz et al., 2020).

**Descriptor computation** — for each keypoint, compute a vector (typically 128–256 dimensions) that describes the local image patch around it. This vector should be similar for the same physical point seen from different viewpoints and different for different points. Classical: SIFT descriptor (128-D histogram of gradients). Modern learned: **SuperPoint descriptors** (256-D), **ALIKE** descriptors, or **DINOv2 patch features**.

For each satellite tile, the pre-extraction step produces:
```
tile_features = {
    keypoints: [(x1,y1), (x2,y2), ...],      # pixel positions
    descriptors: [d1, d2, ...],                # 256-D vectors each
    geo_coords: [(lat1,lon1), (lat2,lon2), ...] # geographic positions
}
```

This is stored alongside the tile imagery. Typical density: 500–5,000 keypoints per tile, depending on terrain complexity.

### Step 3: In-Flight Matching — The Real-Time Pipeline

During flight, the system runs the following pipeline at 1–5 Hz:

**1. Capture a downward-facing image.** The drone's nadir camera grabs a frame. At 100 m altitude with a 90° FOV camera, the ground footprint is roughly 200 m × 150 m.

**2. Extract features from the live image.** Run the same feature detector/descriptor on the live frame. This must be fast — SuperPoint on a Jetson Orin Nano runs at ~30 ms per frame, ALIKED at ~20 ms.

**3. Determine the search region.** The system doesn't search the entire satellite database — that would be too slow. Instead, it uses the drone's approximate position (from VIO + IMU dead-reckoning) to narrow the search to a few candidate tiles. If VIO says the drone is approximately at position P ± 200 m, only tiles covering that region are checked.

**4. Match features.** For each candidate tile, find correspondences between the live frame's descriptors and the tile's pre-extracted descriptors. This is a **nearest-neighbor search** in descriptor space:

- For each live descriptor `d_live`, find the closest descriptor `d_tile` in the candidate tile.
- Apply a **ratio test** (Lowe, 2004): only accept the match if the closest neighbor is significantly closer than the second-closest. This filters out ambiguous matches.
- Modern alternative: **LightGlue** (Lindenberger et al., 2023), a learned matcher that jointly considers all keypoints and uses attention to find correspondences. More accurate than brute-force nearest-neighbor, especially under large viewpoint/appearance changes.

A typical match step produces 20–200 inlier correspondences between the live image and a satellite tile.

**5. Estimate the geometric transformation.** Given matched keypoint pairs `(live_xy, tile_xy)`, estimate the transformation that maps the live image into the satellite tile's coordinate frame. For a nadir-looking camera at moderate altitude, this is well-approximated by a **homography** (8-parameter perspective transform) or an **affine transform** (6 parameters):

```
[x_tile]     [a b c] [x_live]
[y_tile]  =  [d e f] [y_live]
[  1  ]     [g h 1] [  1   ]
```

This is estimated using **RANSAC** — randomly sample 4 point correspondences, compute the homography, count how many other correspondences agree (inliers), repeat, keep the best. RANSAC rejects outlier matches robustly.

**6. Convert to geographic coordinates.** The homography maps the live image's center pixel to a position in the satellite tile's pixel coordinate frame. The satellite tile's georeference (the affine transform in the GeoTIFF header) then maps that pixel position to a latitude/longitude:

```
live_image_center → (tile_pixel_x, tile_pixel_y)   [via homography]
(tile_pixel_x, tile_pixel_y) → (latitude, longitude) [via GeoTIFF affine]
```

The output is a **global position fix**: latitude, longitude, and (from the homography's rotation component) heading. This fix is fed into the state estimator as an observation, correcting VIO/INS drift.

### The Cross-Modality Problem

This pipeline sounds straightforward, but the hard part is that **satellite images and drone images look very different**:

- **Viewpoint**: satellite images are taken from 400–700 km altitude, perfectly nadir. Drone images are from 30–300 m with possible tilt and roll.
- **Time of day**: satellite image from 10:30 AM local (typical for optical satellites). Drone flying at 6 PM or night.
- **Season**: satellite image from summer. Drone flying in winter. Vegetation, snow cover, water levels all change.
- **Sensor**: satellite uses multispectral or panchromatic sensor. Drone uses a standard RGB camera or, at night, an infrared camera. IR vs visible is the hardest gap.
- **Resolution**: satellite at 0.5 m/pixel, drone at 0.02–0.1 m/pixel. The drone sees much more detail than the satellite.

Classical feature descriptors (SIFT, ORB) struggle with these appearance gaps. **Learned descriptors** handle them much better because they're trained on paired satellite/aerial images:

- **Training data**: pairs of `(satellite_patch, drone_patch)` from the same geographic location, captured at different times/seasons/sensors.
- **Training objective**: the network learns to produce similar descriptors for the same location and dissimilar descriptors for different locations, regardless of appearance variation. Contrastive learning (triplet loss, InfoNCE) is the standard approach.
- **Cross-modal networks**: some systems train separate encoder branches for satellite and drone imagery, with a shared embedding space. Others use a single encoder with domain-adaptation layers.

OKSI's OMNInav uses custom AI models trained specifically on satellite-to-aerial matching, supporting both visible and LWIR (long-wave infrared) camera inputs. This enables day/night operation — the drone can match its IR camera feed against visible-light satellite imagery by operating in the learned feature space where the modality gap is bridged.

### Accuracy and Limitations

**Best case** (good satellite imagery, textured terrain, daytime, moderate altitude): **1–5 meter accuracy**, comparable to differential GPS.

**Typical case** (older satellite imagery, mixed terrain, some seasonal change): **5–15 meters**.

**Failure cases**:
- Uniform terrain (water, snow, sand, dense uniform forest) — no distinctive features to match
- Complete cloud cover in the satellite imagery — corrupted reference
- Dramatic terrain change since the satellite image was captured (post-earthquake, post-flood, new construction)
- Very low altitude (<20 m) — the drone sees too small an area with too much detail relative to the satellite resolution, making matching harder
- Night with visible-only camera — no visual features

### Storage and Compute Budget

For a 50 km mission corridor:
- **Satellite imagery**: ~500 MB – 2 GB (compressed, with pre-extracted features)
- **Onboard compute**: SuperPoint + LightGlue + RANSAC runs at ~5 Hz on Jetson Orin Nano (~15W)
- **Latency**: ~200 ms per fix (acceptable — GPS updates at 1–10 Hz)
- **Integration**: outputs a lat/lon/heading observation into the EKF/factor graph at 1–5 Hz, fused with VIO/IMU

This is **entirely feasible on current drone hardware**. A Jetson Orin Nano (\$249), a downward-facing camera (\$50–200), and a 64 GB SD card (\$15) is the full hardware addition. The engineering challenge is in the learned matching models and the mission-planning workflow for pre-loading the right satellite tiles.

---

## 8. Deep Dive: Magnetic Anomaly Navigation — Flying by the Earth's Fingerprint

Magnetic navigation (MagNav) is the dark horse of GPS-denied positioning. It is passive, works at any altitude, day or night, in any weather, emits no signals that can be detected or jammed, and requires only a magnetometer — a sensor that weighs grams and costs dollars. The catch is that it requires a detailed magnetic anomaly map, and extracting the navigation signal from the noise is a serious signal-processing challenge.

### How the Earth's Magnetic Field Varies

Earth's magnetic field has two components relevant to navigation:

**The main field** (~25,000–65,000 nT, depending on latitude) is generated by convection currents in the liquid iron outer core. It varies slowly over years (secular variation) and has a smooth, predictable spatial structure described by the International Geomagnetic Reference Field (IGRF) — a spherical harmonic model updated every 5 years. The main field is what a compass responds to. It tells you which direction is roughly north but doesn't tell you *where you are*, because it changes too slowly and smoothly to serve as a position fingerprint.

**The anomaly field** (~1–1,000 nT, depending on local geology) is caused by magnetized rocks in Earth's crust. Iron-rich basalt, magnetite deposits, fault lines, volcanic intrusions, and even human structures (pipelines, buildings, rail tracks) create local magnetic signatures that vary over distances of meters to kilometers. These anomalies are *the navigation signal*. They form a spatial fingerprint that is unique to each location — like a magnetic barcode printed on the surface of the Earth.

The key insight: **if you have a map of the magnetic anomaly field and a magnetometer on the drone, you can determine your position by matching your measured anomaly against the map**, exactly the same way terrain-contour matching uses altitude profiles or satellite image matching uses visual features.

### The Magnetic Anomaly Map

Several organizations maintain magnetic anomaly maps:

- **EMAG2v3** (NOAA, 2017) — global coverage at 2 arc-minute (~3.7 km) resolution. Free, publicly available. Too coarse for drone navigation (you'd need to fly hundreds of kilometers to accumulate a distinctive signal at this resolution).
- **National geological surveys** — the USGS, British Geological Survey, Geoscience Australia, and equivalents maintain higher-resolution aeromagnetic survey data (50–400 m line spacing) for their territories. Resolution varies; some areas are surveyed at 50 m line spacing (effectively ~100 m spatial resolution of the anomaly map), others at kilometers.
- **Dedicated MagNav surveys** — for military applications, custom high-resolution (10–50 m) magnetic surveys of specific areas of interest. These provide the best MagNav performance but are expensive to acquire and classified.

For MagNav to work at navigation-relevant accuracy (10–100 m), you need an anomaly map with spatial resolution comparable to or better than your desired position accuracy. The 2 arc-minute EMAG2 is useful only for coarse regional positioning. The 50–400 m aeromagnetic surveys available for much of North America, Europe, and Australia can support MagNav with 100–500 m accuracy. Dedicated 10–50 m surveys can potentially achieve 10–50 m accuracy.

### The Measurement Problem: Separating Signal from Noise

The magnetometer on the drone measures the *total* magnetic field, which is the sum of:

1. **The main field** (~50,000 nT) — large, smooth, predictable. Subtract the IGRF model to remove it.
2. **The anomaly field** (~1–1,000 nT) — the navigation signal.
3. **The drone's own magnetic field** (~100–10,000 nT) — generated by electric motors, servos, battery current, wiring, and onboard electronics. This is the largest source of interference and the hardest to remove.
4. **Temporal variations** (~1–100 nT) — diurnal variation, solar storms, magnetic substorms. Slowly varying and mostly removable with real-time or recent reference data.

The fundamental challenge: **the navigation signal (anomaly field, ~1–1000 nT) is often smaller than the drone's own magnetic noise (~100–10,000 nT)**. Extracting it requires sophisticated compensation.

### Aeromagnetic Compensation: The Tolles-Lawson Model

The standard approach to removing the drone's magnetic interference is the **Tolles-Lawson model**, developed in the 1950s for manned aircraft and now adapted for drones. The model describes the aircraft's magnetic interference as a function of its **heading, pitch, and roll** (which determine how the aircraft's permanent and induced magnetic moments project onto the magnetometer's measurement axis):

```
B_aircraft(heading, pitch, roll) =
    Σ(permanent_dipole_terms) +          # fixed magnets in the airframe
    Σ(induced_dipole_terms) +            # soft iron effects from Earth's field
    Σ(eddy_current_terms)                # time-varying fields from maneuvering
```

The model has 18 coefficients (in the standard formulation) that are calibrated by flying a specific pattern — typically a series of heading changes at constant altitude (a "calibration box" or "cloverleaf" pattern) in a magnetically clean area where the anomaly field is known. During calibration, the measured total field is decomposed into the known background (IGRF + local anomaly) and the aircraft interference, and the 18 Tolles-Lawson coefficients are fitted by least squares.

After compensation, the residual aircraft noise can be reduced from ~1,000 nT to ~1–10 nT for a well-designed installation, and to ~10–50 nT for a typical drone where the magnetometer is mounted on a short boom away from the motors.

**Practical drone considerations**:
- Mount the magnetometer on a boom or stinger as far from the motors and battery as possible (30–100 cm helps enormously).
- Use a scalar (total-field) magnetometer rather than a vector magnetometer — scalar measurements are invariant to sensor rotation, eliminating one source of error.
- Optium scalar magnetometers: optically pumped cesium or potassium magnetometers (~0.01 nT sensitivity, but expensive and power-hungry: ~\$5,000–\$20,000, ~5–10 W). More practical: fluxgate magnetometers (~1 nT sensitivity, ~\$100–\$1,000, <1 W) or the MEMS magnetometers already on the drone's flight controller (~100 nT sensitivity — marginal for MagNav without careful compensation).

### The Navigation Algorithm

Given a compensated magnetometer reading and a magnetic anomaly map, the navigation algorithm determines position using one of several approaches:

**1. Batch profile matching (the TERCOM analogue).** Collect a sequence of magnetometer readings along the flight path. Correlate this 1D magnetic profile against all possible profiles in the map that match the drone's approximate heading and speed. The best-correlating profile gives the position. This is simple and robust but requires flying a long enough segment to accumulate a distinctive profile — typically 1–10 km, depending on the anomaly map resolution and the magnetic "texture" of the terrain.

**2. Extended Kalman Filter (EKF).** Treat the magnetic anomaly at the drone's position as a measurement that depends on (unknown) latitude and longitude. The EKF state includes position, velocity, and IMU biases. The magnetic measurement update uses the anomaly map gradient to determine how the field changes with position, providing an observability signal. This gives continuous position updates but requires a map with sufficient spatial gradient — flat magnetic regions provide no information.

**3. Particle filter.** Maintain a cloud of candidate positions ("particles"). For each particle, look up the expected magnetic anomaly from the map. Weight each particle by how well its expected anomaly matches the actual measurement. Resample. Over time, the particle cloud converges on the true position. This handles the non-linearity and multi-modality of the problem better than the EKF but is more compute-intensive.

**4. Neural network matching.** Train a network on sequences of magnetic readings paired with known positions. The network learns to regress position from magnetic time series, potentially capturing complex spatial patterns that the classical methods miss. The MIT Lincoln Laboratory MagNav team has explored this approach with promising results.

### What MagNav Can and Cannot Do

**Strengths**:
- **Completely passive** — no RF emissions, unjammable, undetectable
- **All-weather, all-lighting** — works in fog, rain, night, smoke, underground (to the extent the anomaly map covers it)
- **Lightweight sensor** — a fluxgate magnetometer weighs ~10–50 grams
- **Low compute** — the navigation algorithm (EKF or profile matching) runs on a microcontroller
- **Complements visual methods perfectly** — works exactly where cameras fail (night, fog, featureless terrain), and cameras work where magnetic fields are smooth

**Limitations**:
- **Requires a magnetic anomaly map** — if the area hasn't been surveyed, MagNav can't work
- **Limited accuracy** — typically 50–500 m with publicly available aeromagnetic data, potentially 10–50 m with dedicated surveys. Not a precision solution.
- **Magnetically flat regions** — sedimentary basins, deep ocean, sandy deserts have low magnetic texture. MagNav provides little information there.
- **Drone interference** — the electric motors are strong magnetic sources. Compensation is essential and non-trivial.
- **Temporal stability** — magnetic storms can corrupt measurements for hours. Need to know the geomagnetic activity level (Kp index).

### The MIT Lincoln Lab / USAF MagNav Program

The most advanced publicly documented MagNav program is the US Air Force / MIT Lincoln Laboratory effort, which has:

- Flown MagNav on manned aircraft (Cessna, C-130) with sub-100 m accuracy over magnetically rich terrain in Ontario, Canada
- Published an open-source Julia toolkit (`MagNav.jl`) for magnetic navigation research, including Tolles-Lawson compensation, map interpolation, and EKF/particle filter navigation
- Organized the MagNav challenge competitions to benchmark algorithms on real flight data
- Explored deep learning for aeromagnetic compensation (replacing the 18-coefficient Tolles-Lawson model with a neural network that learns to subtract aircraft interference from raw magnetometer data)

For drones specifically, the challenge is that drone motors produce much more magnetic interference per unit of airframe than a Cessna engine, and the magnetometer is mounted much closer to the interference source. But the same compensation principles apply, and boom-mounted fluxgate magnetometers on fixed-wing drones have demonstrated viable MagNav in field tests.

### A Practical MagNav Architecture for Drones

```
Hardware:
- Fluxgate magnetometer on a 50–100 cm boom (tail stinger)
- IMU (standard flight controller)
- Companion computer (even a Raspberry Pi is sufficient)

Software:
- IGRF model to subtract the main field
- Tolles-Lawson compensation (calibrated before the mission)
- Magnetic anomaly map for the mission area (pre-loaded, ~10–100 MB)
- EKF or particle filter fusing compensated magnetic measurements
  with IMU predictions

Output:
- Position fix at ~1 Hz
- Accuracy: 50–500 m (public aeromagnetic data) or 10–50 m (dedicated survey)
- Fused with VIO/SLAM to provide drift correction in the EKF
```

The total hardware addition is ~\$200–\$1,000 (fluxgate sensor + boom), ~50–100 grams, and negligible power. The bottleneck is the map, not the hardware.

---

## 9. LiDAR SLAM and 3D Methods

LiDAR provides direct, metric, 3D measurements of the environment — no lighting dependence, no feature-tracking fragility. For GPS-denied navigation in structured environments (indoors, underground, urban), LiDAR SLAM is often the most reliable option.

Key systems:

- **LOAM / LeGO-LOAM / LIO-SAM** — the workhorse family. LIO-SAM (Shan et al., 2020) tightly couples LiDAR with IMU and optional GPS in a factor graph, achieving robust real-time SLAM on drones and ground robots.
- **FAST-LIO2** (Xu et al., 2022) — direct LiDAR-inertial odometry without feature extraction, extremely efficient. Runs real-time on modest hardware.
- **Wildcat** (CSIRO) — LiDAR SLAM specifically designed for underground and GPS-denied environments, tested extensively in the DARPA Subterranean Challenge.

**The weight/power problem**: solid-state LiDARs (Livox Mid-360, Ouster OS0) have shrunk to ~200–500 grams and ~10 watts, making them feasible on larger drones (>2 kg). But they're still too heavy for micro/nano drones, and the point cloud processing demands a capable onboard computer.

**Where LiDAR dominates**: underground (mines, tunnels, caves), indoor industrial inspection, nighttime operations, fog/smoke. The DARPA Subterranean Challenge (2018–2021) demonstrated that LiDAR SLAM is the backbone of GPS-denied autonomy in underground environments — every competitive team used it.

---

## 10. The State of the Art: What Actually Works in 2026

The GPS-denied navigation landscape has consolidated around a few architectures that represent the genuine state of the art. Here's what the frontier looks like, ranked by maturity:

### Tier 1: Mature and Operationally Deployed

**VIO + barometer + optical flow** for indoor/short-range. This is a solved problem. PX4 and ArduPilot natively support VIO as a position source. VINS-Fusion, Basalt, or NVIDIA Isaac ROS VSLAM on a Jetson provide reliable navigation for flights under ~500 m in textured environments. Thousands of drones fly this stack daily in warehouses, factories, and for indoor inspection.

**LiDAR SLAM for underground/indoor**. FAST-LIO2 or LIO-SAM on a Livox Mid-360 or Ouster OS0 provides meter-level accuracy in structure-rich environments. Validated extensively in the DARPA SubT Challenge and now deployed commercially for mine inspection, tunnel surveying, and confined-space inspection.

**INS + terminal visual matching for military strike drones.** The pattern validated in Ukraine: fly under GPS where available, switch to pure INS for the final approach (seconds to minutes of coasting), with optional visual terminal guidance against a stored reference image of the target area. KrattWorks' Ghost Dragon and similar systems represent this approach. Accuracy degrades with INS coast time but is sufficient for tactical strike missions.

### Tier 2: Proven in Field Tests, Early Commercial Deployment

**VIO + satellite image matching for outdoor medium-range.** Systems like OKSI's OMNInav, Inertial Labs' VINS solutions, and various DARPA-funded programs combine VIO for local state estimation with satellite image matching for global position corrections. This eliminates VIO drift over distances of 5–50+ km. Accuracy of 5–15 m in favorable conditions. Requires pre-loaded satellite imagery and works best in daytime over textured terrain. The most promising general-purpose GPS-denied architecture for commercial outdoor drones.

**Neural terrain matching for military applications.** End-to-end learned systems that match live camera or IR imagery against pre-loaded reference imagery using deep neural networks (SuperPoint + LightGlue, or custom architectures trained on satellite/aerial pairs). More robust to cross-modality gaps (visible/IR, seasonal change) than classical feature matching. Deployed operationally in Ukraine; the field-tested frontier of learned navigation.

### Tier 3: Demonstrated in Research, Not Yet Widely Deployed

**MagNav as an aiding source.** Magnetic anomaly navigation has been demonstrated on manned aircraft (MIT Lincoln Lab / USAF) and in early drone field tests. Accuracy of 50–500 m with public aeromagnetic data. The technology works, but the map coverage and drone-specific compensation challenges limit deployment. Most promising as a **complementary aiding source** fused with VIO and satellite matching — providing drift correction in conditions (night, fog, featureless terrain) where visual methods fail.

**Multi-modal factor-graph fusion.** The holy grail: a single state estimator (typically GTSAM-based factor graph) that fuses IMU, VIO, barometer, LiDAR, satellite image matching, MagNav, and any other available aiding source, with automatic fault detection and graceful degradation. Research groups at MIT, ETH Zürich, Georgia Tech, and CMU have demonstrated impressive results. Commercial systems (OMNInav, Inertial Labs) are moving toward this architecture. Not yet standardized or widely available as an off-the-shelf solution.

**The HUNT framework.** Developed at NYU, this takes a fundamentally different approach: instead of trying to maintain a global position estimate, the drone navigates using only quantities directly observable from its current sensor readings — altitude from barometer, heading from IMU, motion from optical flow, and target-relative position when a target is visible. The system continuously reconstructs its reference frame from current observations, avoiding accumulated drift entirely. Demonstrated in outdoor field experiments for search-and-track missions. Represents a conceptual shift from "always know where you are globally" to "navigate from what you can see right now."

### Tier 4: Active Research Frontier

**Cross-view geo-localization with foundation models.** Using DINOv2, CLIP, or domain-adapted vision transformers to match aerial imagery against satellite imagery at a semantic level rather than a geometric/feature level. These models can potentially bridge extreme appearance gaps (snow vs. summer, visible vs. IR, drone vs. satellite) because they encode scene semantics rather than low-level textures. Early results are promising but not yet real-time on drone hardware.

**Learned inertial navigation.** Neural networks that learn to correct INS drift directly from raw IMU data, without any external sensor. TLIO (Tight Learned Inertial Odometry, Liu et al., 2020) and subsequent work learn motion priors from data, reducing IMU drift significantly. Not a standalone solution but could extend the useful coast time between external fixes.

**Cooperative multi-drone navigation.** Multiple drones sharing observations to collectively estimate their positions relative to each other and to the environment. If one drone has a GPS fix (or a satellite image match), it can share that with nearby drones via mesh radio, effectively propagating position knowledge through the swarm. Active research at DARPA (OFFSET program) and in academic labs.

---

## 11. Multi-Modal Fusion: The Only Real Answer

No single GPS-denied navigation method works everywhere. The actual answer — and the architecture that every serious system converges on — is multi-modal fusion: combine multiple complementary sensors in a single state estimator that gracefully degrades as individual sensors fail.

A robust architecture for 2026:

```
                    ┌──────────────────────┐
                    │    State Estimator    │
                    │   (Factor Graph /     │
                    │    EKF / MSCKF)       │
                    └──────────┬───────────┘
                               │
     ┌───────┬────────┬────────┼────────┬──────────┬──────────┐
     │       │        │        │        │          │          │
  ┌──┴──┐ ┌──┴───┐ ┌──┴──┐ ┌──┴───┐ ┌──┴─────┐ ┌──┴───┐ ┌───┴────┐
  │ IMU │ │Camera│ │Baro │ │LiDAR │ │Sat Img │ │MagNav│ │Celestial│
  │     │ │ VIO  │ │     │ │      │ │ Match  │ │      │ │  Nav   │
  └─────┘ └──────┘ └─────┘ └──────┘ └────────┘ └──────┘ └────────┘
   1kHz    30Hz     50Hz   10-20Hz    1-5Hz      1Hz     0.1Hz
```

The IMU runs at the highest rate and provides the prediction step. All other sensors provide correction observations at their respective rates. The state estimator weights each observation by its uncertainty and automatically downweights or rejects sensors that disagree with the consensus.

**Factor graph-based fusion** (GTSAM, Ceres) is increasingly preferred over EKF for this because it:
- Naturally handles asynchronous, multi-rate measurements
- Allows re-linearization when loop closures arrive
- Can incorporate constraints of different types (unary position fixes from satellite matching, binary odometry factors from VIO, prior factors from maps)
- Supports incremental solving (iSAM2) for real-time operation

The key insight is that **each sensor covers a different failure mode**:
- VIO fails at night, in fog, over featureless terrain → MagNav and LiDAR keep working
- MagNav fails over magnetically flat terrain → satellite image matching and VIO keep working
- Satellite image matching fails over water/snow → MagNav and INS coast keep working
- LiDAR fails in open sky (no nearby structure) → VIO and satellite matching keep working

No environment defeats *all* sensors simultaneously. The fusion is the resilience.

---

## 12. Lessons from Ukraine

The Ukraine conflict has been the largest real-world stress test of GPS-denied drone navigation in history. Key observations:

1. **GPS denial is the norm, not the exception.** Russian electronic warfare systems (Pole-21, R-330Zh, Krasukha-4) create GPS-denied zones across large areas of the front. Both sides jam and spoof continuously.

2. **Visual terrain matching works operationally.** Ukrainian and allied drone manufacturers (including KrattWorks) have deployed neural-network-based terrain matching that guides FPV and strike drones to targets without GPS. The drone memorizes what the target area looks like from satellite imagery and navigates to it visually.

3. **Inertial coasting is used for terminal guidance.** Some drones fly under GPS until the final approach, then coast on INS for the last seconds/minutes when jamming is most intense. This works for short-range FPV strikes but not for long-range missions.

4. **Fiber-optic-guided drones bypass the problem entirely.** Both sides have deployed fiber-optic-tethered FPV drones where the control signal and video feed run through a spool of fiber optic cable, making them immune to all RF jamming. Navigation is handled by the human operator via the video feed. The trade-off is limited range (typically 5–20 km, bounded by spool length).

5. **The EW arms race is iterative and fast.** Jamming and counter-jamming techniques evolve on timescales of weeks, not years. A navigation solution that works in January may be defeated by February. This puts a premium on software-updatable, multi-modal systems rather than hardware-dependent single-modality solutions.

---

## 13. The Open Problems

Despite rapid progress, several fundamental problems remain unsolved:

**Long-range drift correction without a prior map.** VIO drift makes flights beyond ~5 km unreliable without some form of global correction (terrain matching, satellite image matching, magnetic nav). If no prior map is available, there is no drift-free source, and the drone is slowly getting lost. This is the core unsolved problem for exploration-class missions.

**The featureless-environment problem.** Over water, snow, sand, fog, or at night, visual methods fail. LiDAR helps over water (can measure wave patterns) but not over flat desert or snow. MagNav helps over magnetically rich terrain but not over sedimentary basins. The intersection of "no visual features AND no magnetic texture AND no terrain elevation texture" — deep ocean, flat sandy desert, polar ice — remains truly GPS-dependent.

**Compute, weight, and power constraints.** Running VSLAM + LiDAR SLAM + neural terrain matching + MagNav simultaneously on a 300-gram nano drone is not feasible with current hardware. The most capable GPS-denied systems require Jetson Orin-class compute (~40 TOPS, ~15–25W), which limits them to drones >2 kg. Edge AI hardware is improving rapidly (Hailo, Qualcomm RB5/RB6, NVIDIA Orin NX) but the gap between what the algorithms need and what small drones can carry remains wide.

**Magnetic map coverage.** High-resolution aeromagnetic data exists for perhaps 30–40% of Earth's land surface (primarily North America, Europe, Australia, and parts of Asia and Africa). The rest is unmapped at navigation-relevant resolution. Building a global, high-resolution magnetic anomaly map is a multi-decade, multi-billion-dollar effort — but it's happening incrementally through geological surveys.

**Robustness to adversarial visual conditions.** Smoke, dust, rain, fog, rapid lighting changes, and adversarial IR countermeasures all degrade visual navigation. True all-weather, all-condition navigation remains elusive.

**Real-time map updates.** Terrain-matching methods assume the stored map is accurate. In dynamic environments (urban construction, disaster zones, post-strike terrain), the map may be outdated. Online map updating — incorporating new observations into the reference map during flight — is an active research area with no mature solution.

**Standardization and certification.** There is no equivalent of GPS RAIM (Receiver Autonomous Integrity Monitoring) for GPS-denied navigation. How do you know the navigation solution is trustworthy? How do you detect that it's wrong? Integrity monitoring for multi-modal fusion is essential for civil applications (urban air mobility, package delivery) and is largely unsolved.

---

## 14. What This Means for Builders

If you're building drones that need to operate without GPS, here's the practical stack in 2026:

**For indoor / short-range (<500m):**
- VIO (VINS-Fusion or Isaac ROS VSLAM on Jetson) + barometer + optical flow for altitude
- Add a downward-facing camera + rangefinder
- This is mature and available off-the-shelf (PX4/ArduPilot support VIO as a position source)

**For outdoor, medium-range (500m – 5 km):**
- VIO + barometer + satellite image matching against pre-loaded satellite imagery
- Factor-graph fusion (GTSAM or custom EKF)
- This is where OKSI's OMNInav and similar commercial solutions operate

**For outdoor, long-range (>5 km) or contested environments:**
- Full multi-modal: VIO + satellite image matching + MagNav + INS + barometer
- Neural scene matching for cross-modality (visible/IR vs satellite)
- MagNav for night/fog/featureless conditions (where aeromagnetic data is available)
- Software-updatable to adapt to evolving EW threats
- This is the emerging frontier — DARPA/military-grade, with commercial versions starting to appear

**For underground / subterranean:**
- LiDAR SLAM is mandatory (FAST-LIO2 or LIO-SAM)
- Supplement with VIO for texture-rich areas
- MagNav may work underground if the anomaly map extends below surface
- Ultra-wideband (UWB) beacons if you can pre-deploy infrastructure

The field is moving fast. The combination of Ukraine-driven operational demand, falling sensor costs (solid-state LiDAR under \$500, stereo cameras under \$100, Jetson Orin Nano at \$249, fluxgate magnetometers under \$500), and rapid progress in learned visual navigation means that GPS-denied capability is shifting from military-exclusive to commercially accessible. The builders who figure out robust multi-modal fusion — particularly the combination of satellite image matching (for daytime, textured terrain) and MagNav (for night, fog, featureless terrain) on small, affordable platforms — will own the next generation of drone autonomy.

---

## Further Reading

- Springer survey: "GNSS-denied UAV navigation: analyzing techniques for outdoor localization" (2025). [Link](https://link.springer.com/article/10.1186/s43020-025-00162-z)
- NaviLoc: "Trajectory-Level Visual Localization for GNSS-Denied UAV Navigation" (2026). [MDPI Drones](https://www.mdpi.com/2504-446X/10/2/97)
- HUNT framework: "Rethinking Drone Autonomy in GPS-Denied Environments" (2026). [Weekly Robotics](https://www.weeklyrobotics.com/articles/2026_04_07_rethinking_drone_autonomy_gps_denied/)
- OKSI OMNInav: multi-modal GPS-denied navigation for UAS. [oksi.ai](https://oksi.ai/omninav-gps-denied-navigation/)
- Qin et al., "VINS-Mono: A Robust and Versatile Monocular Visual-Inertial State Estimator" (IEEE T-RO, 2018).
- Campos et al., "ORB-SLAM3: An Accurate Open-Source Library for Visual, Visual-Inertial and Multi-Map SLAM" (IEEE T-RO, 2021).
- Shan et al., "LIO-SAM: Tightly-coupled Lidar Inertial Odometry via Smoothing and Mapping" (IROS 2020).
- Xu et al., "FAST-LIO2: Fast Direct LiDAR-Inertial Odometry" (IEEE T-RO, 2022).
- Teed & Deng, "DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras" (NeurIPS 2021).
- DeTone et al., "SuperPoint: Self-Supervised Interest Point Detection and Description" (CVPR Workshops, 2018).
- Lindenberger et al., "LightGlue: Local Feature Matching at Light Speed" (ICCV, 2023).
- MIT Lincoln Lab MagNav.jl — open-source magnetic navigation toolkit. [GitHub](https://github.com/MIT-AI-Accelerator/MagNav.jl)
- Tolles & Lawson, "Magnetic Compensation of MAD Equipped Aircraft" (1950) — the foundational aeromagnetic compensation paper.
- Canciani & Raquet, "Absolute Position Estimation Using the Earth's Magnetic Anomaly Field" (Navigation, 2016).
- DARPA Subterranean Challenge results and technical reports. [subtchallenge.world](https://www.subtchallenge.world/)
- IEEE Spectrum: "How Ukraine's Killer Drones Are Beating Russian Jamming" (2025).
