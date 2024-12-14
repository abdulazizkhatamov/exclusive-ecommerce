import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function TeamMemberCard({
  name,
  role,
  imageUrl,
  socialLinks,
}: TeamMemberProps) {
  return (
    <Card className="overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="p-10 aspect-square relative">
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            className="object-cover"
          />
        </div>
        <div className="p-4 text-left">
          <h3 className="font-inter font-medium text-[32px] leading-[30px] tracking-[0.04em] text-black">
            {name}
          </h3>
          <p className="font-poppins font-normal text-[16px] leading-[24px] text-black mt-1">
            {role}
          </p>
          <div className="flex justify-start gap-4 mt-4">
            {socialLinks.twitter && (
              <Link
                to={socialLinks.twitter}
                className="text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {socialLinks.instagram && (
              <Link
                to={socialLinks.instagram}
                className="text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            )}
            {socialLinks.linkedin && (
              <Link
                to={socialLinks.linkedin}
                className="text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
