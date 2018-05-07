
export class Survey {

	constructor(public id?: number,
              public name?: string,
              public isOpen?: boolean,
              public bannerUrl?: string,
              public code?: string,
              public createdAt?: Date,
              public defaultLanguage?: string,
              public endsAt?: Date,
              public footerUrl?: string,
              public isActive?: boolean,
              public rejectionLink?: string,
              public startsAt?: Date,
              public successLink?: string,
              public updatedAt?: Date) {

	}

}
