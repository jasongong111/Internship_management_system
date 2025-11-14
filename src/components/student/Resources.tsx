import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  FileText,
  Download,
  ExternalLink,
  Video,
  BookOpen,
} from "lucide-react";

export function Resources() {
  const resources = [
    {
      title: "Internship Briefing Slides",
      description:
        "Overview of internship requirements and procedures",
      type: "PDF",
      icon: FileText,
      size: "2.4 MB",
    },
    {
      title: "Endorsement Application Template",
      description:
        "Template for preparing your endorsement application",
      type: "DOCX",
      icon: FileText,
      size: "156 KB",
    },
    {
      title: "Work Report Template",
      description:
        "Official template for internship work reports",
      type: "DOCX",
      icon: FileText,
      size: "234 KB",
    },
    {
      title: "Self-Reflection Guidelines",
      description:
        "Guidelines for writing effective self-reflections",
      type: "PDF",
      icon: BookOpen,
      size: "890 KB",
    },
    {
      title: "Internship Video Tutorial",
      description:
        "Step-by-step guide to submitting your application",
      type: "Video",
      icon: Video,
      size: "Online",
    },
  ];

  const quickLinks = [
    {
      title: "Career Services",
      url: "#",
      description:
        "Visit HKBU Career Services for job opportunities",
    },
    {
      title: "Internship FAQ",
      url: "#",
      description:
        "Frequently asked questions about internships",
    },
    {
      title: "Contact Coordinator",
      url: "#",
      description:
        "Get in touch with your department coordinator",
    },
    {
      title: "Student Handbook",
      url: "#",
      description:
        "View the complete student internship handbook",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resources & Templates</CardTitle>
          <CardDescription>
            Download helpful resources, templates, and
            guidelines for your internship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#003366] rounded-lg p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {resource.type} • {resource.size}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Helpful links and additional resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <h4 className="group-hover:text-[#003366] transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {link.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#003366]" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="mb-2 text-[#003366]">
                Department Coordinator
              </h4>
              <p className="text-sm text-gray-700 mb-2">
                Dr. LAI, Jean Hok Yin
                <br />
                Email: jeanlai@comp.hkbu.edu.hk
                <br />
                Office: RRS 721
                <br />
                Phone: +852 3411 5597
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="mb-2">Technical Support</h4>
              <p className="text-sm text-gray-700">
                For technical issues with the system, please
                contact:
                <br />
                Email: itsupport@comp.hkbu.edu.hk
                <br />
                Phone: +852 3411 5050
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}