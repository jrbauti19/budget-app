import auth from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = useCallback(async () => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      alert('User account created & signed in!');
    } catch (error) {
      console.error(error);
      const err = error as FirebaseError;
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const signIn = useCallback(async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      alert('User account signed in!');
    } catch (error) {
      const err = error as FirebaseError;
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await auth().signOut();
      alert('User account signed out!');
    } catch (error) {
      const err = error as FirebaseError;
      alert('Logout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ width: '100%' }}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email"
        ></TextInput>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Password"
        ></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button
              title="Sign Up"
              onPress={signUp}
              disabled={loading}
            ></Button>
            <Button
              title="Sign In"
              onPress={signIn}
              disabled={loading}
            ></Button>
            <Button
              title="Log Out"
              onPress={logout}
              disabled={loading}
            ></Button>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});
