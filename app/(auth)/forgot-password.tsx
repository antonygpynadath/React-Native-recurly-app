import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posthog } from "../../lib/posthog";

const ForgotPassword = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;
  const emailFormValid = emailAddress.length > 0 && emailValid;
  const passwordFormValid = password.length >= 8;

  const handleSendCode = async () => {
    if (!emailFormValid) return;

    const { error: createError } = await signIn.create({
      identifier: emailAddress,
    });
    if (createError) {
      console.error(JSON.stringify(createError, null, 2));
      return;
    }

    const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendCodeError) {
      console.error(JSON.stringify(sendCodeError, null, 2));
      return;
    }

    setCodeSent(true);
    posthog?.capture("password_reset_code_sent");
  };

  const handleVerifyCode = async () => {
    if (!code) return;

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    posthog?.capture("password_reset_code_verified");
  };

  const handleResetPassword = async () => {
    if (!passwordFormValid) return;

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // submitPassword completes the sign-in and creates a session — activate it
    // and enter the app instead of sending the user back to sign-in.
    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(tabs)");
          if (url.startsWith("http")) {
            if (typeof window !== "undefined" && window.location) {
              window.location.href = url;
            } else {
              router.replace("/(tabs)" as Href);
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
      if (finalizeError) {
        console.error(JSON.stringify(finalizeError, null, 2));
        return;
      }
      posthog?.capture("password_reset_completed");
    } else {
      console.error("Password reset not complete:", signIn);
    }
  };

  const handleStartOver = () => {
    signIn.reset();
    setCodeSent(false);
    setCode("");
    setPassword("");
    setPasswordTouched(false);
  };

  // Step 3: Set new password
  if (signIn.status === "needs_new_password") {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurrly</Text>
                    <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                  </View>
                </View>
                <Text className="auth-title">Set new password</Text>
                <Text className="auth-subtitle">Choose a strong password for your account</Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">New Password</Text>
                    <View className="auth-password-wrap">
                      <TextInput
                        className={`auth-input auth-input-password ${passwordTouched && !passwordValid && "auth-input-error"}`}
                        value={password}
                        placeholder="Enter new password"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        onBlur={() => setPasswordTouched(true)}
                        autoComplete="password-new"
                      />
                      <Pressable
                        className="auth-password-toggle"
                        onPress={() => setShowPassword((prev) => !prev)}
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={22}
                          color="rgba(0, 0, 0, 0.45)"
                        />
                      </Pressable>
                    </View>
                    {passwordTouched && !passwordValid && (
                      <Text className="auth-error">Password must be at least 8 characters</Text>
                    )}
                    {errors.fields.password && (
                      <Text className="auth-error">{errors.fields.password.message}</Text>
                    )}
                    {!passwordTouched && (
                      <Text className="auth-helper">Minimum 8 characters required</Text>
                    )}
                  </View>

                  <Pressable
                    className={`auth-button ${(!passwordFormValid || fetchStatus === "fetching") && "auth-button-disabled"}`}
                    onPress={handleResetPassword}
                    disabled={!passwordFormValid || fetchStatus === "fetching"}
                  >
                    <Text className="auth-button-text">
                      {fetchStatus === "fetching" ? "Resetting..." : "Reset Password"}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={handleStartOver}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text className="auth-secondary-button-text">Start Over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 2: Verify OTP
  if (codeSent) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurrly</Text>
                    <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                  </View>
                </View>
                <Text className="auth-title">Check your email</Text>
                <Text className="auth-subtitle">We sent a verification code to {emailAddress}</Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className="auth-input"
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0, 0, 0, 0.4)"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {errors.fields.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  <Pressable
                    className={`auth-button ${(!code || fetchStatus === "fetching") && "auth-button-disabled"}`}
                    onPress={handleVerifyCode}
                    disabled={!code || fetchStatus === "fetching"}
                  >
                    <Text className="auth-button-text">
                      {fetchStatus === "fetching" ? "Verifying..." : "Verify Code"}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={async () => {
                      const { error } = await signIn.resetPasswordEmailCode.sendCode();
                      if (error) {
                        console.error(JSON.stringify(error, null, 2));
                        return;
                      }
                      posthog?.capture("password_reset_code_sent");
                    }}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text className="auth-secondary-button-text">Resend Code</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={handleStartOver}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text className="auth-secondary-button-text">Start Over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 1: Request reset code
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                </View>
              </View>
              <Text className="auth-title">Forgot password?</Text>
              <Text className="auth-subtitle">
                Enter your email and we&apos;ll send you a reset code
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email Address</Text>
                  <TextInput
                    className={`auth-input ${emailTouched && !emailValid && "auth-input-error"}`}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {emailTouched && !emailValid && (
                    <Text className="auth-error">Please enter a valid email address</Text>
                  )}
                  {errors.fields.identifier && (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${(!emailFormValid || fetchStatus === "fetching") && "auth-button-disabled"}`}
                  onPress={handleSendCode}
                  disabled={!emailFormValid || fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">
                    {fetchStatus === "fetching" ? "Sending..." : "Send Reset Code"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Remember your password?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
