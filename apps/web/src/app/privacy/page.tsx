import Link from "next/link";

import { LegalPageShell } from "@/components/legal/LegalPageShell";

const LAST_UPDATED = "April 18, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy policy" lastUpdated={LAST_UPDATED}>
      <p className="text-muted-foreground">
        Open Estate Sales (&quot;OES,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) explains here how we collect, use, and share information
        when you use our websites, marketplace, operator tools, APIs, and developer
        resources (collectively, the &quot;Service&quot;). By using the Service, you
        agree to this Privacy Policy together with our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>

      <section>
        <h2 id="collect" className="mt-10 text-base">
          1. Information we collect
        </h2>
        <h3 className="text-sm">Account and authentication</h3>
        <p>
          When you register or sign in, we may collect identifiers such as email
          address, authentication tokens, and profile details you choose to provide
          (for example, operator business name). If you use third-party sign-in
          (such as OAuth), we receive information that provider shares with us
          according to your settings with them.
        </p>
        <h3 className="text-sm">Listings and marketplace content</h3>
        <p>
          Operators may submit descriptions, schedules, locations (which may be
          approximate or exact depending on product behavior), and{" "}
          <strong>photographs</strong>. Photos may depict private homes and personal
          property; treat this content as sensitive.
        </p>
        <h3 className="text-sm">Usage and technical data</h3>
        <p>
          We collect logs and diagnostics such as IP address, device and browser
          type, timestamps, pages or endpoints accessed, and error reports. For API
          and developer access, we may log request metadata needed for security,
          billing eligibility, and rate limiting.
        </p>
      </section>

      <section>
        <h2 id="use" className="mt-10 text-base">
          2. How we use information
        </h2>
        <ul>
          <li>Provide, operate, maintain, and improve the Service.</li>
          <li>
            Authenticate users, prevent fraud and abuse, and enforce our Terms and
            policies.
          </li>
          <li>
            Apply rate limits, quotas, and technical restrictions on APIs and keys.
          </li>
          <li>
            Communicate with you about the Service (for example, security or policy
            notices).
          </li>
          <li>Comply with law and respond to lawful requests.</li>
        </ul>
        <p>
          We do not sell your personal information in the conventional sense of
          selling lists of individuals to data brokers. We may use processors and
          service providers (for example, hosting or email) under contractual
          safeguards.
        </p>
      </section>

      <section>
        <h2 id="operators" className="mt-10 text-base">
          3. Operators, listings, and ownership
        </h2>
        <p>
          Operators generally <strong>own the listing content</strong> they provide.
          To run the marketplace, operators grant us the rights described in our{" "}
          <Link href="/terms">Terms of Service</Link> to host, display, and
          distribute that content as part of the Service. Public-facing listings
          may be visible to shoppers and search engines according to product
          behavior and your settings.
        </p>
      </section>

      <section>
        <h2 id="developers" className="mt-10 text-base">
          4. Developers and your end users
        </h2>
        <p>
          If you build on our APIs or SDKs and collect personal data from people who
          use <strong>your</strong> application, you act as an independent
          controller or business (as defined under applicable law).{" "}
          <strong>
            You must provide your own privacy notice and lawful basis for that
            collection
          </strong>
          . We are not responsible for your app&apos;s privacy practices.
        </p>
      </section>

      <section>
        <h2 id="sharing" className="mt-10 text-base">
          5. Sharing and subprocessors
        </h2>
        <p>
          We may share information with vendors who help us host, secure, analyze,
          or communicate about the Service, subject to confidentiality and security
          obligations. We may disclose information if required by law, to protect
          rights and safety, or in connection with a merger, acquisition, or asset
          transfer, with notice where appropriate.
        </p>
      </section>

      <section>
        <h2 id="retention" className="mt-10 text-base">
          6. Retention
        </h2>
        <p>
          We retain information for as long as your account is active or as needed to
          provide the Service, comply with legal obligations, resolve disputes, and
          enforce our agreements. Experimental or free-tier environments may reset data
          periodically; see in-product notices.
        </p>
      </section>

      <section>
        <h2 id="security" className="mt-10 text-base">
          7. Security
        </h2>
        <p>
          We use reasonable administrative, technical, and organizational measures
          designed to protect information. No method of transmission or storage is
          perfectly secure; we cannot guarantee absolute security. See also our{" "}
          <Link href="/terms">Terms of Service</Link> regarding service availability
          and disclaimers.
        </p>
      </section>

      <section>
        <h2 id="rights" className="mt-10 text-base">
          8. Your choices and rights
        </h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete,
          or export personal information, or to object to certain processing. To
          exercise these rights, contact us through channels on our website. We may
          need to verify your request.
        </p>
      </section>

      <section>
        <h2 id="children" className="mt-10 text-base">
          9. Children
        </h2>
        <p>
          The Service is not directed at children under 13 (or the age required in
          your jurisdiction). We do not knowingly collect personal information from
          children.
        </p>
      </section>

      <section>
        <h2 id="international" className="mt-10 text-base">
          10. International users
        </h2>
        <p>
          If you access the Service from outside the United States, you understand
          that information may be processed in the United States or other countries
          where we or our providers operate, which may have different data protection
          rules than your country.
        </p>
      </section>

      <section>
        <h2 id="changes" className="mt-10 text-base">
          11. Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the new
          version and change the &quot;Last updated&quot; date. Where changes are
          material, we may provide additional notice through the Service or email.
        </p>
      </section>

      <section>
        <h2 id="contact" className="mt-10 text-base">
          12. Contact
        </h2>
        <p>
          Privacy questions: use the contact options on{" "}
          <Link href="/">openestatesales.com</Link> or the project repository where
          applicable.
        </p>
      </section>

      <p className="border-t border-border pt-8 text-xs text-muted-foreground">
        This policy summarizes our current practices and is not legal advice.
      </p>
    </LegalPageShell>
  );
}
