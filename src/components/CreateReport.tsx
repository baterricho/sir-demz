import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { LocationMap } from "./LocationMap";
import {
  Phone,
  User,
  Settings,
  LogOut,
  Upload,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { User as UserType, Report, Page } from "../App";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { PUERTO_PRINCESA_BARANGAYS } from "../utils/barangays";

interface CreateReportProps {
  user: UserType;
  onSubmit: (
    report: Omit<
      Report,
      "id" | "trackingId" | "dateSubmitted" | "timeline"
    >,
  ) => Report;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function CreateReport({
  user,
  onSubmit,
  onNavigate,
  onLogout,
}: CreateReportProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    isConfidential: false,
    isEmergency: false,
    emergencyType: "",
    emergencyDetails: "",
    location: "",
    barangay: user.barangay || "",
    purok: user.purok || "",
    street: user.street || "",
    attachments: [] as string[],
  });
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barangaySearch, setBarangaySearch] = useState("");

  // Filter barangays based on search input
  const filteredBarangays = useMemo(() => {
    if (!barangaySearch) return PUERTO_PRINCESA_BARANGAYS;
    return PUERTO_PRINCESA_BARANGAYS.filter((b) =>
      b.toLowerCase().includes(barangaySearch.toLowerCase())
    );
  }, [barangaySearch]);

  const categories = [
    "Infrastructure",
    "Emergency",
    "Public Safety",
    "Health Services",
    "Environmental",
    "Complaint",
    "Others",
  ];

  const emergencyTypes = [
    "Medical Emergency",
    "Fire",
    "Accident",
    "Crime in Progress",
    "Natural Disaster",
    "Other Emergency",
  ];

  const handleUseCurrentLocation = () => {
    setLocationStatus("loading");

    if (!navigator.geolocation) {
      setLocationStatus("error");
      toast.error(
        "Geolocation is not supported by this browser",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock address lookup based on coordinates
        const mockAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setFormData((prev) => ({
          ...prev,
          location: mockAddress,
        }));
        setLocationStatus("success");
        toast.success(
          "Current location detected successfully!",
        );
      },
      (error) => {
        setLocationStatus("error");
        let errorMessage = "Failed to get current location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        ...formData,
        userId: user.id,
        userName: user.name,
        status: "Submitted" as const,
      };

      const newReport = onSubmit(reportData);
      
      toast.success("Report submitted successfully!", {
        description: `Your tracking ID is: ${newReport.trackingId}`,
        duration: 5000,
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        isConfidential: false,
        isEmergency: false,
        emergencyType: "",
        emergencyDetails: "",
        location: "",
        barangay: user.barangay || "",
        purok: user.purok || "",
        street: user.street || "",
        attachments: [],
      });
      setLocationStatus("idle");

      // Navigate to dashboard
      setTimeout(() => {
        onNavigate("dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // In a real app, you'd upload these files and get URLs
      const mockUrls = fileArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...mockUrls],
      }));
      toast.success(`${files.length} file(s) attached successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">
                SafetyConnect
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-gray-600 hover:text-gray-700"
              >
                Home
              </button>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Report Issue
              </button>
              <button
                onClick={() => onNavigate("sos")}
                className="text-gray-600 hover:text-gray-700"
              >
                SOS Emergency
              </button>
              <button
                onClick={() => onNavigate("track-reports")}
                className="text-gray-600 hover:text-gray-700"
              >
                Track Reports
              </button>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Report
          </h2>
          <p className="text-gray-600">
            Submit a detailed report about issues in your
            community
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Report Details
            </CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help
              us address your concern effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confidential"
                    checked={formData.isConfidential}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isConfidential: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="confidential"
                    className="text-sm"
                  >
                    Keep my identity confidential in this report
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergency"
                    checked={formData.isEmergency}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isEmergency: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="emergency"
                    className="text-sm text-red-600"
                  >
                    This is an emergency requiring immediate
                    attention
                  </Label>
                </div>
              </div>

              {/* Emergency Section */}
              {formData.isEmergency && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Emergency Report Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyType">
                        Emergency Type
                      </Label>
                      <Select
                        value={formData.emergencyType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select emergency type" />
                        </SelectTrigger>
                        <SelectContent>
                          {emergencyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyDetails">
                        Emergency Details
                      </Label>
                      <Textarea
                        id="emergencyDetails"
                        placeholder="Additional details about the emergency..."
                        rows={3}
                        value={formData.emergencyDetails}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyDetails: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <Alert className="border-red-300 bg-red-100">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        For life-threatening emergencies, please call 911
                        immediately. This form should not be used as a
                        substitute for emergency services.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter the location manually"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    disabled={locationStatus === "loading"}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {locationStatus === "loading" ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                    Use Current
                  </Button>
                </div>
                {locationStatus === "success" && (
                  <p className="text-sm text-green-600">
                    ✓ Location detected successfully
                  </p>
                )}
                {locationStatus === "error" && (
                  <p className="text-sm text-red-600">
                    ✗ Failed to detect location
                  </p>
                )}
              </div>

              {/* Barangay, Purok, Street */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay</Label>
                  <Select
                    value={formData.barangay}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        barangay: value,
                      }))
                    }
                  >
                    <SelectTrigger id="barangay">
                      <SelectValue placeholder="Select a barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {PUERTO_PRINCESA_BARANGAYS.map((barangay) => (
                        <SelectItem key={barangay} value={barangay}>
                          {barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purok">Purok</Label>
                  <Input
                    id="purok"
                    placeholder="e.g., Mahogany"
                    value={formData.purok}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        purok: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    placeholder="e.g., Elm Street"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="attachments">
                  Attachments (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <span className="text-blue-600 hover:text-blue-700">
                        Click to upload files
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        or drag and drop
                      </span>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {formData.attachments.length} file(s) attached
                  </div>
                )}
              </div>

              {/* Location Map - Only show if location was manually entered, not from GPS */}
              {formData.location && locationStatus !== "success" && (
                <div className="space-y-2">
                  <Label>Location Preview</Label>
                  <div className="h-64 rounded-lg overflow-hidden border">
                    <LocationMap
                      reports={[]}
                      onReportSelect={() => {}}
                      userLocation={formData.location}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-start gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate("dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  {isSubmitting && (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Floating Emergency SOS Button - Always Accessible */}
      <Button 
        onClick={() => onNavigate('sos')}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Emergency SOS - Quick Access"
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}
