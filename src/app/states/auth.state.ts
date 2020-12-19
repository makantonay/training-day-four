import { LoginAuth, SetToken } from './auth.actions';
import { AuthService } from './../services/auth.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from '@ngxs/store';

export class  AuthStateModel {
  auth: any;
  token: any;
  logged?: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    auth: null,
    token: null,
    logged: false
  }
})

@Injectable()
export class AuthState {
  constructor(private _authService: AuthService) {}

  @Selector()
  static auth(state: AuthStateModel): any {
    return state.auth;
  }

  @Selector()
  static token(state: AuthStateModel): any {
    return atob(state.token);
  }

  @Selector()
  static logged(state: AuthStateModel): any {
    return state.logged;
  }

  @Action(LoginAuth, { cancelUncompleted: true})
  loginAuth({ patchState, dispatch}: StateContext<AuthStateModel>, { auth }: LoginAuth): void {
    this._authService.login(auth).subscribe(
      (response: any) => {
        if(response.status === 'success'){
          patchState({ logged: true});
        }
      },
      (response: any) => {
        if(response.error){
          const error = response.error;
          error.code = response.status;

          console.log(error.message);
        }
      }
    )
  }

  @Action(SetToken)
  SetToken({ patchState}: StateContext<AuthStateModel>, { token }: SetToken): void {
    token = btoa(token);

    patchState({token});
    localStorage.setItem('token', token);
  }

}
