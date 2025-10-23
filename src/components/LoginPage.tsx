import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Eye,
  EyeOff,
  Shield,
  User as UserIcon,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { User, Page } from "../App";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
  onRegister: (user: User) => void;
}

export function LoginPage({
  onLogin,
  onNavigate,
  onRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [idPhoto, setIdPhoto] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        alert("Please enter both email and password");
        return;
      }

      if (!email.includes('@')) {
        alert("Please enter a valid email address");
        return;
      }

      // Import authentication function
      const { authenticateUser } = await import('../utils/storage');
      
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        onLogin(authenticatedUser);
      } else {
        alert("Please enter a valid email address and password.");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !email || !phoneNumber || !address) {
      alert("Please fill in all required fields");
      return;
    }

    if (!idPhoto) {
      alert("Please upload a photo of your government-issued ID for verification");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Import storage functions
      const { saveUserToDatabase, validateUserData } = await import('../utils/storage');
      
      // Create new user with comprehensive data
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${firstName} ${lastName}`,
        email: email,
        type: "user",
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        idPhoto,
        idVerificationStatus: 'pending',
      };

      // Validate user data
      const validationErrors = validateUserData(newUser);
      if (validationErrors.length > 0) {
        alert(`Registration failed:\n${validationErrors.join('\n')}`);
        return;
      }

      // Note: In this demo, we allow multiple registrations with the same email
      // In production, you would check for existing accounts

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock delay
      
      // Save user to database
      saveUserToDatabase(newUser, password);
      
      onRegister(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-500">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">
              SafetyConnect
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={!isRegistering ? "default" : "ghost"}
              className={
                !isRegistering
                  ? "bg-white text-blue-600 hover:bg-white/90"
                  : "text-white hover:bg-white/10"
              }
              onClick={() => setIsRegistering(false)}
            >
              Login
            </Button>
            <Button
              variant={isRegistering ? "default" : "outline"}
              className={
                isRegistering
                  ? "bg-white text-blue-600 hover:bg-white/90"
                  : "border-white/30 text-white hover:bg-white/10"
              }
              onClick={() => setIsRegistering(true)}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isRegistering ? "Create Account" : "Welcome"}
            </h2>
            <p className="text-blue-100">
              {isRegistering
                ? "Join the SafetyConnect platform"
                : "Sign in to your SafetyConnect account"}
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl text-gray-800">
                {isRegistering ? "Sign Up" : "Sign In"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isRegistering
                  ? "Enter your information to create account"
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={
                  isRegistering ? handleRegister : handleLogin
                }
                className="space-y-4"
              >
                {isRegistering && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Your last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+63 XXX XXX XXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="address"
                          type="text"
                          placeholder="Your complete address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>


                    {/* ID Verification Section */}
                    <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                        <h4 className="font-medium text-amber-800">ID Verification Required</h4>
                      </div>
                      <p className="text-sm text-amber-700">
                        To ensure the safety and security of our platform, we require all users to verify their identity by uploading a government-issued ID.
                      </p>
                      <ImageUpload
                        onImageUpload={setIdPhoto}
                        onImageRemove={() => setIdPhoto("")}
                        currentImage={idPhoto}
                        label="Government-Issued ID"
                        description="Upload a clear photo of your driver's license, passport, or national ID"
                        maxSizeMB={3}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        isRegistering
                          ? "Create a password (min 6 characters)"
                          : "Enter your password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      minLength={isRegistering ? 6 : undefined}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword,
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}



                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isRegistering
                      ? "Creating Account..."
                      : "Signing In..."
                    : isRegistering
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isRegistering ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setIsRegistering(false);
                          setName("");
                          setConfirmPassword("");
                          setIdPhoto("");
                        }}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Sign in here
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Sign up here
                      </button>
                    </>
                  )}
                </p>
              </div>



              {isRegistering && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    New to SafetyConnect?
                  </h4>
                  <p className="text-sm text-blue-700">
                    By creating an account, you'll be able to
                    report issues, track their progress, and use
                    emergency services. You'll need to accept
                    our Terms & Conditions to continue.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6">
        <div className="flex justify-center gap-6 text-sm text-blue-100">
          <button
            onClick={() => onNavigate("terms")}
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => onNavigate("privacy")}
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-blue-200">
          © 2025 SafetyConnect
        </div>
      </footer>
    </div>
  );
}