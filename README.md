# Website Optimisation Examples

Think of this as a playground to practice website optimisations

- SEO keyword optimisation
- ~~Having the same image available in multiple sizes~~
- ~~Having the same audio available in multiple formats~~
- Having the same video available in multiple formats
- ~~Concatenate CSS files into one and compress it~~
- Caching data between the API and Database
- Caching data between the browser and the API
- Measuring optimisations

### Lighthouse Chrome Extension

I'm using Lighthouse to help rank the optimisations and provide guidance on areas in which I can provide.

### We'll support multiple endpoints with / without optimisations to help measure the difference

- GET /optimised.html
- GET /unoptimised.html

```shell
time curl -w 'Connect: %{time_connect}s, TTLL: %{time_starttransfer}s, Total: %{time_total}s' -o /dev/null -s https://disruptionlaboratory.com
Connect: 0.025981s, TTLL: 0.093256s, Total: 0.093407scurl -w  -o /dev/null -s https://disruptionlaboratory.com  0.01s user 0.01s system 20% cpu 0.111 total
```

Using Cache-Control header

```shell
time curl -w 'Connect: %{time_connect}s, TTLL: %{time_starttransfer}s, Total: %{time_total}s' -o /dev/null -s https://disruptionlaboratory.com -H "Cache-Control: no-cache"
```

```shell
docker compose -p website-optimisation-examples up -d
```

## Images

Okay, it's helpful to have the same image in multiple sizes and then let the device itself determine which one to download.

One approach is to simply base it on the supported pixel density of the device itself.

Larger images are for screens that support a greater density.

```js
[
  { width: 320, density: 1 },
  { width: 640, density: 2 },
  { width: 1024, density: 3 },
];
```

Here is a suggested naming convention:

- character@1x.png 1x: For devices with 1x pixel density (typical desktop).
- character@2x.png 2x: For devices with 2x pixel density (Retina displays).
- character@3x.png 3x: For devices with 3x pixel density (some high-end smartphones).

```html
<img
  src="/images/character@1x.png"
  srcset="
    /images/character@1x.png 1x,
    /images/character@2x.png 2x,
    /images/character@3x.png 3x
  "
  alt="Character"
/>
```

For background images in CSS, it's possible to implement something similar:

```css
.background-image {
  background-image: image-set(
    url("/images/character@1x.png") 1x,
    url("/images/character@2x.png") 2x,
    url("/images/character@3x.png") 3x
  );
  background-size: cover;
}
```

WebP is a new image format that provides more efficient compression and supports transparency.  It's also supported by modern browsers.
It can also replace animated GIFs.

```shell
cwebp -q 80 character@1x.png -o character@1x.webp
cwebp -q 80 character@2x.png -o character@2x.webp
cwebp -q 80 character@3x.png -o character@3x.webp
```


## Audio

It's often necessary to support multiple encodings for audio.

- MP3 has expired patents but is the most supported and well-known.
- AAC is more advanced than MP3. Wider range of sound and more efficient compression. But licencing is complex.
- OGG is open source and royalty-free.

Here, I'm using ffmpeg to encode to MP3, OGG and AAC from WAV.

```shell
ffmpeg -i bellamy-output.wav bellamy.mp3
ffmpeg -i bellamy-output.wav bellamy.ogg
ffmpeg -i bellamy-output.wav bellamy.aac
```

Here is some example markup:

```html
<audio controls>
  <source src="/audio/bellamy.mp3" type="audio/mpeg" />
  <source src="/audio/bellamy.ogg" type="audio/ogg" />
  <source src="/audio/bellamy.aac" type="audio/aac" />
  Your browser does not support the audio element.
</audio>
```

### Video

My iPhone 14 resolution: 1080x1920 in portrait and 1920x1080 in landscape mode

When capturing a video and then sharing it via iPhone, the file format will be MOV. This is a container and not a codec. iPhones often use a combination of H.264 or H.265 (HEVC) video with AAC audio inside a .MOV container.

- Most modern web browsers can play .MOV files, especially if they're using H.264 video inside. 
- However, there are a few nuances. H.264 is generally safe: This codec has excellent support across browsers (Chrome, Firefox, Safari, Edge, etc.).
- H.265 (HEVC) is a problem for some: HEVC offers better compression (smaller file sizes) but is not universally supported. Older browsers or those without specific codecs installed might struggle. Safari used to have better HEVC support, but support is increasingly standardized now.
- ProRes: iPhones sometimes record in ProRes (particularly in higher-end models and professional modes). ProRes is not a web-friendly codec. It's designed for editing and produces very large files. Browsers won't play ProRes.

Okay, so it's often possible to just slap up a MOV file but we're not going to do it because:

- It's too heavy - that is, it's a very big file size taking up storage space and bandwidth
- Will take ages to upload and download
- Might not be supported on every device
- Might use up someone's mobile data allowance

#### Recommendation:

- Convert from MOV container to MP4 container which is the most widely supported
- Video Codec: H.264 (AVC) - This is your safest bet for broadest compatibility
- Audio Codec: AAC (Advanced Audio Coding) - Standard and well-supported
- Resolution: Consider reducing the resolution if the original is very high. 1920x1080 (1080p) is generally good. You could even go lower (e.g., 1280x720 - 720p) to further reduce file size, especially if the video isn't critically important to be full HD.
- Bitrate: This is key. Experiment, but a good starting point for 1080p H.264 is around 5-8 Mbps (megabits per second). For 720p, 2-4 Mbps might be sufficient. Lower the bitrate if you need even smaller file sizes.


#### Getting Codec information

```shell
ffprobe example.MOV
```

```shell
ffprobe version 7.1.1 Copyright (c) 2007-2025 the FFmpeg developers
  built with Apple clang version 16.0.0 (clang-1600.0.26.6)
  configuration: --prefix=/opt/homebrew/Cellar/ffmpeg/7.1.1_2 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags='-Wl,-ld_classic' --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libaribb24 --enable-libbluray --enable-libdav1d --enable-libharfbuzz --enable-libjxl --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libssh --enable-libsvtav1 --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-videotoolbox --enable-audiotoolbox --enable-neon
  libavutil      59. 39.100 / 59. 39.100
  libavcodec     61. 19.101 / 61. 19.101
  libavformat    61.  7.100 / 61.  7.100
  libavdevice    61.  3.100 / 61.  3.100
  libavfilter    10.  4.100 / 10.  4.100
  libswscale      8.  3.100 /  8.  3.100
  libswresample   5.  3.100 /  5.  3.100
  libpostproc    58.  3.100 / 58.  3.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'example.MOV':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2025-09-03T13:29:16.000000Z
    com.apple.quicktime.location.accuracy.horizontal: 16.241963
    com.apple.quicktime.full-frame-rate-playback-intent: 0
    com.apple.quicktime.location.ISO6709: +51.4147-002.2628+048.593/
    com.apple.quicktime.make: Apple
    com.apple.quicktime.model: iPhone 11
    com.apple.quicktime.software: 18.6.2
    com.apple.quicktime.creationdate: 2025-09-03T14:29:16+0100
  Duration: 00:00:10.94, start: 0.000000, bitrate: 8214 kb/s
  Stream #0:0[0x1](und): Video: hevc (Main) (hvc1 / 0x31637668), yuv420p(tv, bt709), 1920x1080, 7977 kb/s, 29.97 fps, 29.97 tbr, 600 tbn (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Video
        vendor_id       : [0][0][0][0]
        encoder         : HEVC
      Side data:
        displaymatrix: rotation of -90.00 degrees
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 175 kb/s (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Audio
        vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](und): Data: none (mebx / 0x7862656D), 0 kb/s (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Metadata
  Stream #0:3[0x4](und): Data: none (mebx / 0x7862656D), 1 kb/s (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Metadata
  Stream #0:4[0x5](und): Data: none (mebx / 0x7862656D), 34 kb/s (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Metadata
  Stream #0:5[0x6](und): Data: none (mebx / 0x7862656D), 0 kb/s (default)
      Metadata:
        creation_time   : 2025-09-03T13:29:16.000000Z
        handler_name    : Core Media Metadata
Unsupported codec with id 0 for input stream 2
Unsupported codec with id 0 for input stream 3                                                                                                                                                                                    
Unsupported codec with id 0 for input stream 4                                                                                                                                                                                    
Unsupported codec with id 0 for input stream 5  
```

Here is the command to use ffmpeg to convert from MOV to MP4.  Note libx265 is HEVC.
```shell
ffmpeg -i "example.MOV" -c:v libx265 -crf 23 -preset medium -c:a aac -b:a 175k "example.mp4"
```

Here is the command to use ffmpeg to convert from MOV to MP4.  Note libx264 is H.264.  As mentioned, H.264 is supported on more devices.
```shell
ffmpeg -i "example.MOV" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 175k "example.mp4"
```

#### YouTube

Important Considerations and Tips for YouTube Shorts:

- Vertical Video: Ensure your video is absolutely vertical (9:16 aspect ratio). YouTube will often reformat videos that aren't, which can negatively impact the viewing experience.
- Short and Sweet: Keep your Shorts concise. Aim for the shortest duration that effectively conveys your message.
- Captions: Add captions to your Shorts, as many people watch videos with the sound off.
- Engaging Content: Shorts are designed to be highly engaging, so create content that grabs attention quickly.
- Testing: Upload a test Short to YouTube to confirm that the video appears correctly and the quality is acceptable.

Formats:

- MP4
- MOV
- AVI
- WMV
- FLV
- WebM

Dimensions:

- 1920x1080 HD (This is a good standard for most videos.)
- 2560x1440 2K (Good for higher detail, especially on larger screens.)
- 3840x2160 4K (For high-resolution content)

Aspect Ratio: 16:9 is the standard for YouTube videos.

Frame rates:

- 24 fps (cinematic look)
- 25 fps (PAL standard)
- 30 fps (NTSC standard)
- 60 fps (smooth motion, good for gaming or fast action)

| Scenario | Description                                                     | Command                                                                                                 |
| -------- |-----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
 | Scenario 1: Convert to 1080p (Full HD), MP4 Format | This is a good general-purpose command for most YouTube videos. | ffmpeg -i "input.mov" -c:v libx264 -preset medium -vf "scale=1920:1080" -c:a aac -b:a 175k "output.mp4" |
| Scenario 2: Convert to 1440p (QHD/2K), MP4 Format | For higher-resolution content.                                  | ffmpeg -i "input.mov" -c:v libx264 -preset medium -vf "scale=2560:1440" -c:a aac -b:a 175k "output.mp4" |
| Scenario 3: Convert to 4K (2160p/UHD), MP4 Format | For very high-resolution content.                               | ffmpeg -i "input.mov" -c:v libx264 -preset medium -vf "scale=3840:2160" -c:a aac -b:a 175k "output.mp4" |
| Scenario 4: Converting to 1080x1920 (Full HD) for Shorts | This is the recommended approach for optimal quality.           | ffmpeg -i "input.mov" -c:v libx264 -preset medium -vf "scale=1080:1920" -c:a aac -b:a 175k "output.mp4" |
| Scenario 5: Converting to a Minimum Resolution of 720x1280 (HD) for Shorts | If your original video has a lower resolution, this command will upscale it while maintaining the 9:16 aspect ratio.      |  ffmpeg -i "input.mov" -c:v libx264 -preset medium -vf "scale=720:1280" -c:a aac -b:a 175k "output.mp4"


#### Aspect Ratio Calculations

A 9:16 aspect ratio means for every 9 units of width, there are 16 units of height. This is the common aspect ratio for mobile phones (vertical videos).

1. Given Height, Calculate Width

Formula: Width = (Height * 9) / 16

Example: Let's say you want your video to be 1080 pixels high:

Width = (1080 * 9) / 16
Width = 9720 / 16
Width = 607.5 pixels

2. Given Width, Calculate Height

Formula: Height = (Width * 16) / 9

Example: Let's say you want your video to be 480 pixels wide:

Height = (480 * 16) / 9
Height = 7680 / 9
Height = 853.33 pixels

| Width |	Height |
| ----- | -------- |
| 480 | 854 |
|607	|1080|
|720	|1280|
|1080|	1920|
|1215|	2160|
|1440|	2560|


#### Optimisations

- Low Resolution (e.g., 480p): For older phones and slower connections.
- Medium Resolution (e.g., 720p): A good balance of quality and size. Probably your "default" size.
- High Resolution (e.g., 1080p): For larger screens and users with fast connections.
- Very High Resolution (e.g., 4K – 2160p): Only if your content justifies it and you're targeting users with large, high-resolution displays and very fast internet. This can significantly increase file sizes.


~~Best quality first, then working down in quality.  The browser will ultimately decide and get the size from the webserver.~~
Nothing to do with quality, it's just choosing the first one based on codec.  LLM made up some BS.

We can still achieve it using JS in the browser or via API endpoint, however.  It's just going to be rolling our own solution or using something off-the-shelf, it isn't a standard.

```html
<video width="100%" height="auto" controls poster="/videos/example.jpg">
<!--    <source src="/videos/example-1080p.mp4" type="video/mp4">-->
    <source src="/videos/example-720p.mp4" type="video/mp4">
<!--    <source src="/videos/example-480p.mp4" type="video/mp4">-->
  Your browser does not support the video tag.
</video>
```

```shell
ffmpeg -i "example.MOV" -c:v libx264 -preset medium -vf "scale=1080:1920" -c:a aac -b:a 175k "example-1080p.mp4"
ffmpeg -i "example.MOV" -c:v libx264 -preset medium -vf "scale=720:1280" -c:a aac -b:a 175k "example-720p.mp4"
ffmpeg -i "example.MOV" -c:v libx264 -preset medium -vf "scale=480:854" -c:a aac -b:a 175k "example-480p.mp4"
```

Let's also extract image from the video to use as poster image.

```shell
ffmpeg -i example-1080p.mp4 -ss 00:00:02 -frames:v 1 example.jpg
```

Let's optimise even further by using webp format for the poster image.
```shell
ffmpeg -i example-1080p.mp4 -ss 00:00:02 -frames:v 1 example.webp
```

#### Next Steps

- Delegate the video file selection to the API endpoint based on headers from client
- Support range requests
- Use HLS (HTTP Live Streaming) or DASH (Dynamic Adaptive Streaming over HTTP)
- Use CDN networks