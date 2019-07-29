export interface ViewPortSize {
  width: number;
  height: number;
}

export interface AuthUser {
  email: string;
  password: string;
}

export interface HtmlElements {
  entrarButton: string;
  emailInput: string;
  passwordInput: string;
  submitButton: string;
  elemTitle: string;
  elemNextButton: string;
}

export interface IConfig {
  auth: AuthUser;
  url: string;
  videoNumber?: number;
  viewPortSize?: ViewPortSize;
}

export interface VideoObject {
  request: {
      files: {
          progressive: [
              {
                  quality: string,
                  url: string,
              }
          ]
      }
  }
}