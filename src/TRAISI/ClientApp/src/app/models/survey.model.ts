
export class Survey {

	constructor(private _id?: string,
		private _name?: string,
		private _isOpen?: boolean,
		private _bannerUrl?: string,
		private _code?: string,
		private _createdAt?: Date,
		private _defaultLanguage?: string,
		private _endsAt?: Date,
		private _footerUrl?: string,
		private _isActive?: boolean,
		private _rejectionLink?: string,
		private _startsAt?: Date,
		private _successLink?: string,
		private _updatedAt?: Date) {

	}


	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get isOpen(): boolean {
		return this._isOpen;
	}

	set isOpen(value: boolean) {
		this._isOpen = value;
	}

	get bannerUrl(): string {
		return this._bannerUrl;
	}

	set bannerUrl(value: string) {
		this._bannerUrl = value;
	}

	get code(): string {
		return this._code;
	}

	set code(value: string) {
		this._code = value;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	set createdAt(value: Date) {
		this._createdAt = value;
	}

	get defaultLanguage(): string {
		return this._defaultLanguage;
	}

	set defaultLanguage(value: string) {
		this._defaultLanguage = value;
	}

	get endsAt(): Date {
		return this._endsAt;
	}

	set endsAt(value: Date) {
		this._endsAt = value;
	}

	get footerUrl(): string {
		return this._footerUrl;
	}

	set footerUrl(value: string) {
		this._footerUrl = value;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	set isActive(value: boolean) {
		this._isActive = value;
	}

	get rejectionLink(): string {
		return this._rejectionLink;
	}

	set rejectionLink(value: string) {
		this._rejectionLink = value;
	}

	get startsAt(): Date {
		return this._startsAt;
	}

	set startsAt(value: Date) {
		this._startsAt = value;
	}

	get successLink(): string {
		return this._successLink;
	}

	set successLink(value: string) {
		this._successLink = value;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	set updatedAt(value: Date) {
		this._updatedAt = value;
	}
}
