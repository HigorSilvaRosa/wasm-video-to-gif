import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wasm-video-to-gif';

  ffmpeg: FFmpeg;
  isReady = false;

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    this.ffmpeg = createFFmpeg({ log: true });
    await this.ffmpeg.load();
    // Flag que indica que está pronto.
    this.isReady = true;
  }

  gifUrlData: string;

  async selectedFile(event) {
    // Pegando arquivo do evento 'change'
    const videoFile: File = event.target.files?.item(0);
    // Carregando o arquivo de vídeo na memória em 'video.mp4'
    this.ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoFile));
    // Executando o comando do FFMpeg para converter 'video.mp4' para 'video.gif' (2,5 segundos de duração)
    await this.ffmpeg.run('-i', 'video.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'video.gif');
    // Lendo resultado de 'video.gif'
    const gifData = this.ffmpeg.FS('readFile', 'video.gif');
    // Criando uma URL com dados do gif
    this.gifUrlData = URL.createObjectURL(new Blob([gifData.buffer], { type: 'image/gif' }));
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

}
