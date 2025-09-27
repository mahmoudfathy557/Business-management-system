import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { loadUserFromStorage } from './src/redux/slices';

export default function App() {
  useEffect(() => {
    // Load user from storage on app start
    store.dispatch(loadUserFromStorage());
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PaperProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </PaperProvider>
      </Provider>
    </ErrorBoundary>
  );
}
