export interface IRequestServiceCreateShortLink {
  originalLink: string;
  captcha: string;
}

export interface IResponseServiceCreateShortLink {
  shortLink: string;
  originalLink: string;
}
