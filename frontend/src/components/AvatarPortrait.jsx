import { useState } from "react";

const sizeClassMap = {
  sm: "avatar-portrait avatar-portrait-sm",
  md: "avatar-portrait avatar-portrait-md",
  lg: "avatar-portrait avatar-portrait-lg"
};

const getInitials = (name = "AI") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

function AvatarPortrait({ avatar, size = "md" }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={sizeClassMap[size] || sizeClassMap.md}
      style={{
        "--avatar-from": avatar?.accentFrom || "#60a5fa",
        "--avatar-to": avatar?.accentTo || "#0f172a"
      }}
    >
      {avatar?.image && !imageFailed ? (
        <img
          src={avatar.image}
          alt={avatar.name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{getInitials(avatar?.name)}</span>
      )}
    </div>
  );
}

export default AvatarPortrait;
