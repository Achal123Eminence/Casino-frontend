import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  /**
   * getCanvasHash function.
   * @returns {*} Result.
   */
  private getCanvasHash(): string | null {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.textBaseline = 'top';
      ctx.font = "16px 'Arial'";
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Fingerprint', 2, 2);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Fingerprint', 4, 4);

      return canvas.toDataURL();
    } catch {
      return null;
    }
  }

  /**
   * getWebGLInfo function.
   * @returns {*} Result.
   */
  private getWebGLInfo(): { vendor: string, renderer: string } | null {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return null;

      const webgl = gl as WebGLRenderingContext;  // ✅ Type cast fix

      const dbgRenderInfo = webgl.getExtension('WEBGL_debug_renderer_info') as any;
      const vendor = dbgRenderInfo
        ? webgl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL)
        : webgl.getParameter(webgl.VENDOR);
      const renderer = dbgRenderInfo
        ? webgl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
        : webgl.getParameter(webgl.RENDERER);

      return { vendor: vendor as string, renderer: renderer as string };
    } catch {
      return null;
    }
  }

  /**
   * getAudioFingerprint function.
   * @returns {Promise<*>} Result.
   */
  private async getAudioFingerprint(): Promise<string | null> {
    try {
      /**
       * AudioContext function.
       * @returns {*} Result.
       */
      const AudioContext = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      if (!AudioContext) return null;

      const ctx = new AudioContext(1, 44100, 44100);
      const oscillator = ctx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, 0);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, 0);

      oscillator.connect(compressor);
      compressor.connect(ctx.destination);
      oscillator.start(0);

      const rendered = await ctx.startRendering();
      const channelData = rendered.getChannelData(0).slice(0, 1000);

      let sum = 0;
      for (let i = 0; i < channelData.length; i++) {
        sum += Math.abs(channelData[i]);
      }

      return String(Math.round(sum * 1000000));
    } catch {
      return null;
    }
  }

  /**
   * getLocalIPs function.
   * @returns {Promise<*>} Result.
   */
  private async getLocalIPs(): Promise<string[]> {
    const ips = new Set<string>();
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.onicecandidate = (evt) => {
        if (!evt.candidate) return;
        const parts = evt.candidate.candidate.split(' ');
        parts.forEach(part => {
          if (/(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}/.test(part)) {
            ips.add(part);
          }
        });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await new Promise(r => setTimeout(r, 500));
      pc.close();
    } catch {
      // ignore
    }
    return Array.from(ips);
  }

  /**
   * getMediaDevices function.
   * @returns {Promise<*>} Result.
   */
  private async getMediaDevices(): Promise<any[] | null> {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return null;
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.map(d => ({
        kind: d.kind,
        label: d.label || '',
        deviceId: d.deviceId || ''
      }));
    } catch {
      return null;
    }
  }

  /**
   * collect function.
   * @returns {Promise<*>} Result.
   */
  async collect(): Promise<any> {
    const components: any = {};
    try {
      components.userAgent = navigator.userAgent || null;
      components.platform = navigator.platform || null;
      components.language = navigator.language || null;
      components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      components.hardwareConcurrency = (navigator as any).hardwareConcurrency || null;
      components.deviceMemory = (navigator as any).deviceMemory || null;
      components.screen = `${screen.width}x${screen.height}x${window.devicePixelRatio || 1}`;

      components.canvasHash = this.getCanvasHash();

      const webgl = this.getWebGLInfo();
      components.webglVendor = webgl ? webgl.vendor : null;
      components.webglRenderer = webgl ? webgl.renderer : null;

      components.audioHash = await this.getAudioFingerprint();
      components.localIPs = await this.getLocalIPs();
      components.mediaDevices = await this.getMediaDevices();

      if ((navigator as any).getBattery) {
        try {
          const b = await (navigator as any).getBattery();
          components.battery = { charging: b.charging, level: b.level };
        } catch {}
      }

      components.tzOffset = new Date().getTimezoneOffset();
    } catch (e) {
      console.error('collect error', e);
    }
    return components;
  }
}
