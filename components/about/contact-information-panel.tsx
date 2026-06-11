import { Edit3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AboutContactConfig } from "@/lib/about-data";

interface ContactInformationPanelProps {
  contact: AboutContactConfig;
  onEdit: () => void;
}

export function ContactInformationPanel({ contact, onEdit }: ContactInformationPanelProps) {
  const contactItems = [
    {
      title: contact.officeLabel,
      icon: MapPin,
      content: [contact.officeName, contact.branchCity, contact.contactPerson, ...contact.address.split("\n")].filter(Boolean)
    },
    {
      title: "Phone",
      icon: Phone,
      content: contact.phoneNumbers
    },
    {
      title: "Email",
      icon: Mail,
      content: [contact.email]
    },
    {
      title: "Website",
      icon: ExternalLink,
      content: [contact.website]
    }
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Contact Information</CardTitle>
          {contact.notes ? <p className="mt-1 text-sm leading-6 text-slate-500">{contact.notes}</p> : null}
        </div>
        <Button type="button" variant="outline" className="shrink-0 gap-2 text-blue-700" onClick={onEdit}>
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit Contact Information
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="min-w-0 truncate text-sm font-bold text-slate-950">{item.title}</h3>
                </div>
                <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                  {item.content.map((line) =>
                    item.title === "Email" ? (
                      <a key={line} className="block min-w-0 truncate font-semibold text-blue-700 hover:underline" href={`mailto:${line}`}>
                        {line}
                      </a>
                    ) : item.title === "Website" ? (
                      <a key={line} className="block min-w-0 truncate font-semibold text-blue-700 hover:underline" href={`http://${line}`}>
                        {line}
                      </a>
                    ) : (
                      <p key={line}>{line}</p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
