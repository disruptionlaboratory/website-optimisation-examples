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
