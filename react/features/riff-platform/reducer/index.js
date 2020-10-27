import { combineReducers } from 'redux';

import { ReducerRegistry } from '../../base/redux';

import profile from './profile';
import signIn from './signIn';
import signUp from './signUp';

ReducerRegistry.register('features/riff-platform',
  combineReducers({
      signIn,
      signUp,
      profile
  })
);
