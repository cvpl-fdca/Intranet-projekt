import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createUser } from './createUserOnSignup';

admin.initializeApp();

exports.createUser = functions.auth.user().onCreate(createUser);
