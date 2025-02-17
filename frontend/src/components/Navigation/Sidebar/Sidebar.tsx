import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  Sparkles,
  Video,
  Images,
  Settings,
  Palette,
  FileArchiveIcon as FileCompress,
  BookImage,
  Lock,
  User,
} from "lucide-react"
import CustomizationPopup from "./CustomizationPopup"
import ImageCompressor from "./ImageCompressor"
import AvatarCropper from "./AvatarCropper"
import { defaultStyles, type CustomStyles } from "./styles"

const Sidebar = () => {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showImageCompressor, setShowImageCompressor] = useState(false)
  const [styles, setStyles] = useState<CustomStyles>(defaultStyles)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [showAvatarCropper, setShowAvatarCropper] = useState(false)
  const [croppedAvatar, setCroppedAvatar] = useState<string | null>(null)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    document.body.style.backgroundColor = styles.uiBackgroundColor
  }, [styles.uiBackgroundColor])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      ;(event.target as HTMLElement).click()
    }
  }, [])

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setAvatarError(null)

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please upload a valid image file (JPEG, PNG, GIF)")
      return
    }

    setIsAvatarLoading(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
        setIsAvatarLoading(false)
        setShowAvatarCropper(true)
      }
      reader.onerror = () => {
        setAvatarError("Error reading file. Please try again.")
        setIsAvatarLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setAvatarError("An unexpected error occurred. Please try again.")
      setIsAvatarLoading(false)
    }
  }

  const handleCropComplete = (croppedImage: string) => {
    setCroppedAvatar(croppedImage)
    setShowAvatarCropper(false)
  }

  const sidebarStyle = {
    background: styles.bgColor,
    color: styles.textColor,
    borderColor: styles.borderColor,
    borderRadius: `${styles.borderRadius}px`,
    backgroundSize: "cover",
    fontFamily: styles.fontFamily,
    fontSize: `${styles.fontSize}px`,
    width: isExpanded ? `${styles.expandedWidth}px` : `${styles.sidebarWidth}px`,
    "--bg-active": styles.activeBackgroundColor,
    "--text-active": styles.activeTextColor,
    "--bg-hover": styles.hoverBackgroundColor,
  } as React.CSSProperties

  const navItems = [
    { path: "/home", label: "Home", Icon: Home },
    { path: "/ai-tagging", label: "AI Tagging", Icon: Sparkles },
    { path: "/videos", label: "Videos", Icon: Video },
    { path: "/albums", label: "Albums", Icon: Images },
    { path: "/settings", label: "Settings", Icon: Settings },
    { path: "/secure-folder", label: "Secure Folder", Icon: Lock },
    { path: "/memories", label: "Memories", Icon: BookImage },
  ]

  return (
    <>
      {styles.backgroundVideo && (
        <div className="fixed inset-0 z-[-1] h-full w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 transform object-cover"
          >
            <source src={styles.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="p-4">
        <nav
          className="sidebar relative z-10 flex h-[calc(90vh-2rem)] flex-col justify-between rounded-3xl border-r transition-all duration-300 ease-in-out"
          style={sidebarStyle}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          aria-label="Main Navigation"
        >
          <div className="mt-2 flex flex-col items-center">
            {/* Enhanced Avatar Section */}
            <div className="relative group mb-6">
              <div
                className={`avatar-container relative cursor-pointer transition-all duration-300 ${
                  isAvatarLoading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => document.getElementById("avatarUpload")?.click()}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label="Change profile picture"
              >
                <div className="relative h-24 w-24 rounded-full border-4 border-white/20 hover:border-primary transition-colors duration-300 shadow-lg overflow-hidden">
                  {croppedAvatar ? (
                    <img
                      src={croppedAvatar || "/placeholder.svg"}
                      alt="User Avatar"
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : avatar ? (
                    <img
                      src={avatar || "/placeholder.svg"}
                      alt="User Avatar"
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <User className="h-12 w-12 text-white/80" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium text-center">Change Photo</span>
                  </div>
                </div>

                {isAvatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {avatarError && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm w-max max-w-[200px] text-center">
                  {avatarError}
                </div>
              )}

              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
                aria-describedby="avatarError"
              />
            </div>

            {/* Navigation Items */}
            {navItems.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                className={`group m-1 flex flex-col items-center gap-1 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  isActive(path)
                    ? "bg-[var(--bg-active)] text-[var(--text-active)] shadow-md"
                    : "text-default hover:bg-[var(--bg-hover)]"
                }`}
                aria-current={isActive(path) ? "page" : undefined}
              >
                <Icon
                  style={{
                    width: styles.iconSize,
                    height: styles.iconSize,
                    color: styles.iconColor,
                  }}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap font-medium">{label}</span>
              </Link>
            ))}

            <button
              onClick={() => setShowImageCompressor(true)}
              className="group m-1 flex w-full flex-col items-center gap-1 rounded-lg p-4 text-default transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-hover)] active:scale-[0.98]"
              aria-label="Open Image Compressor"
              onKeyDown={handleKeyDown}
            >
              <FileCompress
                style={{
                  width: styles.iconSize,
                  height: styles.iconSize,
                  color: styles.iconColor,
                }}
                aria-hidden="true"
              />
              <span className="font-medium">Compressor</span>
            </button>
          </div>

          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => setShowCustomize(true)}
              className="bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] rounded-lg p-2 transition-all duration-300 focus:outline-none"
              aria-label="Customize sidebar"
              onKeyDown={handleKeyDown}
            >
              <Palette size={20} />
            </button>
          </div>
        </nav>
      </div>

      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-800">
            <CustomizationPopup styles={styles} setStyles={setStyles} onClose={() => setShowCustomize(false)} />
          </div>
        </div>
      )}

      {showImageCompressor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-800">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Image Compressor</h2>
            </div>
            <ImageCompressor />
          </div>
        </div>
      )}

      {showAvatarCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 dark:bg-gray-800">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Crop Avatar</h2>
            </div>
            <AvatarCropper image={avatar as string} onCropComplete={handleCropComplete} />
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar