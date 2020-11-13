import { combineReducers } from 'redux';

import { ReducerRegistry } from '../../base/redux';

import meeting from './meeting';
import meetings from './meetings';
import profile from './profile';
import scheduler from './scheduler';
import signIn from './signIn';
import signUp from './signUp';

ReducerRegistry.register('features/riff-platform',
  combineReducers({
      signIn,
      signUp,
      profile,
      meetings,
      meeting,
      scheduler
  })
);
