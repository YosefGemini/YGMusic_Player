import {
  AudioContext,
  AudioManager,
  PlaybackNotificationManager,
} from "react-native-audio-api";
import type { AudioBufferSourceNode } from "react-native-audio-api";

import {
  createEqualizerGraph,
  type EqualizerGraph,
} from "../equalizer/equalizerGraph";

export interface PlayerTrack {
  id: string;
  uri: string;
  title: string;
  artist?: string;
  album?: string;
  artworkUri?: string;
  duration?: number;
}

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "ended";

export interface PlayerEngineListeners {
  onStatusChange?: (status: PlayerStatus) => void;
  onTrackChange?: (track: PlayerTrack | null) => void;
  onError?: (error: Error) => void;
}

/**
 * PHASE 0 SPIKE.
 *
 * A minimal, framework-free playback engine that proves the core audio path:
 *   file → decodeAudioData → AudioBufferSourceNode → 15-band EQ → destination
 * plus the Android foreground service / media notification (PlaybackNotificationManager)
 * and audio-focus handling (AudioManager).
 *
 * The production engine (Phase 4) will swap `decodeAudioData` for the library's
 * streaming `<Audio>` / AudioFileSourceNode path to avoid decoding whole files
 * into memory, but the insertion point for effects is identical:
 *   source.connect(equalizer.input); equalizer.output.connect(destination).
 */
export class PlayerEngine {
  private readonly context: AudioContext;
  readonly equalizer: EqualizerGraph;

  private source: AudioBufferSourceNode | null = null;
  private current: PlayerTrack | null = null;
  private status: PlayerStatus = "idle";
  private volume = 1;
  private interrupted = false;

  private readonly listeners: PlayerEngineListeners;
  private readonly subscriptions: { remove: () => void }[] = [];

  constructor(listeners: PlayerEngineListeners = {}) {
    this.listeners = listeners;
    this.context = new AudioContext();
    this.equalizer = createEqualizerGraph(this.context);
    this.equalizer.output.connect(this.context.destination);
    this.configureSession();
  }

  private configureSession(): void {
    AudioManager.setAudioSessionOptions?.({
      iosCategory: "playback",
      iosMode: "default",
      iosOptions: ["allowBluetoothA2DP", "allowAirPlay"],
    });
    AudioManager.observeAudioInterruptions?.("gain");

    const interruption = AudioManager.addSystemEventListener?.(
      "interruption",
      (event) => {
        if (event.type === "began") {
          this.interrupted = true;
          if (this.status === "playing") this.pause();
        } else if (event.type === "ended" && event.shouldResume && this.interrupted) {
          this.interrupted = false;
          void this.play();
        }
      },
    );
    if (interruption) this.subscriptions.push(interruption);

    const remote = PlaybackNotificationManager.addEventListener?.(
      "playbackNotificationPlay",
      () => void this.play(),
    );
    const remotePause = PlaybackNotificationManager.addEventListener?.(
      "playbackNotificationPause",
      () => this.pause(),
    );
    if (remote) this.subscriptions.push(remote);
    if (remotePause) this.subscriptions.push(remotePause);
  }

  private setStatus(status: PlayerStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.listeners.onStatusChange?.(status);
    void PlaybackNotificationManager.show?.({
      title: this.current?.title,
      artist: this.current?.artist,
      album: this.current?.album,
      artwork: this.current?.artworkUri,
      duration: this.current?.duration,
      state: status === "playing" ? "playing" : "paused",
    });
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  getCurrentTrack(): PlayerTrack | null {
    return this.current;
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.source) {
      // AudioBufferSourceNode exposes a `volume` setter on the shared base class.
      (this.source as unknown as { volume?: number }).volume = this.volume;
    }
  }

  /** Decodes a local file and routes it through the EQ chain. Spike-only path. */
  async load(track: PlayerTrack): Promise<void> {
    this.setStatus("loading");
    this.current = track;
    this.listeners.onTrackChange?.(track);
    try {
      const buffer = await this.context.decodeAudioData(track.uri);
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.equalizer.input as never);
      source.onEnded = () => this.setStatus("ended");
      this.disposeSource();
      this.source = source;
      if (this.status === "playing") this.startSource(0);
      else this.setStatus("paused");
    } catch (error) {
      this.setStatus("idle");
      this.listeners.onError?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  private startSource(offset: number): void {
    if (!this.source) return;
    this.source.start(0, offset);
    void this.context.resume();
    this.setStatus("playing");
  }

  private disposeSource(): void {
    if (!this.source) return;
    try {
      this.source.stop();
    } catch {
      // start() may not have been called; ignore.
    }
    this.source.disconnect();
    this.source = null;
  }

  async play(): Promise<void> {
    if (!this.source) return;
    await this.context.resume();
    this.startSource(0);
  }

  pause(): void {
    if (!this.source) return;
    this.disposeSource();
    this.setStatus("paused");
  }

  stop(): void {
    this.disposeSource();
    this.current = null;
    this.listeners.onTrackChange?.(null);
    void PlaybackNotificationManager.hide?.();
    this.setStatus("idle");
  }

  /** Releases all native resources and subscriptions. */
  dispose(): void {
    this.disposeSource();
    this.subscriptions.forEach((subscription) => subscription.remove());
    this.subscriptions.length = 0;
    void this.context.close();
  }
}
