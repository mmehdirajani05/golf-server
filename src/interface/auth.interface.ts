/* eslint-disable prettier/prettier */
  export interface AuthLoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthRegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    address: string;
    state: string;
    phone: string;
  }

  export interface AuthForgotRequest {
    email: string;
  }
  export interface AuthVerifyRequest {
    code: string;
    email: string;
  }
  export interface AuthResetPasswordRequest {
    code: string;
    email: string;
    new_password: string;
  }
  export interface AuthUpdatePasswordRequest {
    email: string;
    old_password: string;
    new_password: string;
  }
  