import profileReducer, { resetProfileState, profile } from '@/store/profileSlice';

describe('profileSlice', () => {
  const initialState = {
    isLoading: false,
    data: null,
    isError: false,
  };

  it('should return the initial state', () => {
    expect(profileReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle resetProfileState', () => {
    const stateWithData = {
      isLoading: false,
      data: { username: 'test' },
      isError: false,
    };
    const actual = profileReducer(stateWithData, resetProfileState());
    expect(actual).toEqual(initialState);
  });

  it('should handle profile.pending', () => {
    const action = { type: profile.pending.type };
    const state = profileReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.data).toBeNull();
    expect(state.isError).toBe(false);
  });

  it('should handle profile.fulfilled', () => {
    const mockPayload = { username: 'john' };
    const action = { type: profile.fulfilled.type, payload: mockPayload };
    const state = profileReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockPayload);
    expect(state.isError).toBe(false);
  });

  it('should handle profile.rejected', () => {
    const mockError = { message: 'failed' };
    const action = { type: profile.rejected.type, error: mockError };
    const state = profileReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(true);
    expect(state.data).toEqual(mockError);
  });
});
