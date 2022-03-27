import { StatusBar } from 'expo-status-bar';
import { LogBox, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppContextProvider from './src/context/app-context';
import NavContainer from './src/navigation';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.',
  `Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info.
(Saw setTimeout with duration 300000ms)`
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <NavContainer colorScheme={colorScheme} />
        </QueryClientProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

