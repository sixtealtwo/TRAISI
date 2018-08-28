import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { DownloadNotification } from '../models/download-notification';

@Injectable({ providedIn: 'root' })
export class RealTimeNotificationServce {
	private hubConnection: HubConnection;
	private channels: Map<string, Subject<any>> = new Map<string, Subject<any>>();

	constructor(private authService: AuthService) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl('/notify', { accessTokenFactory: () => this.authService.accessToken, logger: LogLevel.None })
			.build();
		this.hubConnection.start();

		this.hubConnection.on('downloadUpdate', (downloadInfo: DownloadNotification) => {
			let subject = this.channels.get(downloadInfo.id);
			subject.next(downloadInfo);
		});
	}

	public registerDownloadChannel(channelId: string): Subject<DownloadNotification> {
		let downloadNotifier: Subject<DownloadNotification> = new Subject<DownloadNotification>();
		this.channels.set(channelId, downloadNotifier);
		return downloadNotifier;
	}
}
