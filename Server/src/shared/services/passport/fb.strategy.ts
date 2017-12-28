import * as passport from 'passport';
import { get } from 'config';
import * as FbTokenStrategy from 'passport-facebook-token';
import { Component } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Component()
export class FacebookStrategy extends FbTokenStrategy {
  constructor(private readonly authService: AuthService) {
    super(
      {
        clientID: get<string>('secrets.fb.appId'),
        clientSecret: get<string>('secrets.fb.appSecret')
        // , profileFields: ['id', 'displayName', 'photoes', 'email']

      },
      async (accessToken, refreshToken, profile, done) =>
        await this.verifyFb(accessToken, refreshToken, profile, done)
    );
    passport.use(this);
  }

  async verifyFb(accessToken, refreshToken, profile, done) {
    console.log(`[fb.strategy->verifyFb()]:: accessToken: ${accessToken}, profile: ${JSON.stringify(profile)}`);
    try {
      const savedfbUser = await this.authService.validateOrCreateFbUser(profile, accessToken);
      if (!savedfbUser) {
        return done(`[fb.strat->varifyFb()]::Failed; input: accToken: ${accessToken};
                               profile: ${JSON.stringify(profile)}`, null);
      }
      return done(null, savedfbUser);
    } catch (e) {
      console.log(`[fb.strategy->verifyFb() Catch block]:: error ${JSON.stringify(e)}`);

    }
  }
}