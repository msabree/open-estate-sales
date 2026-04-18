import Link from "next/link";

import { LegalPageShell } from "@/components/legal/LegalPageShell";

const LAST_UPDATED = "April 18, 2026";

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of service" lastUpdated={LAST_UPDATED}>
      <p className="text-muted-foreground">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of
        the websites, applications, APIs, and related services offered by Open
        Estate Sales (&quot;OES,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;), including the consumer marketplace, operator tools, and
        developer resources (collectively, the &quot;Service&quot;). By using the
        Service, creating an account, or using an API key, you agree to these
        Terms.
      </p>

      <section>
        <h2 id="definitions" className="mt-10 text-base">
          1. Definitions
        </h2>
        <ul>
          <li>
            <strong>&quot;Operator&quot;</strong> means a user who lists or
            manages estate sales through the Service.
          </li>
          <li>
            <strong>&quot;Developer&quot;</strong> means a user who accesses our
            APIs, SDKs, or developer portal to build integrations or
            applications.
          </li>
          <li>
            <strong>&quot;API Key&quot;</strong> means any credential we issue for
            programmatic access to the Service.
          </li>
          <li>
            <strong>&quot;User Content&quot;</strong> means text, images, listings,
            and other materials you submit to the Service.
          </li>
        </ul>
      </section>

      <section>
        <h2 id="eligibility" className="mt-10 text-base">
          2. Eligibility and accounts
        </h2>
        <p>
          You must be able to form a binding contract in your jurisdiction to use
          the Service. You are responsible for the activity that occurs under your
          account and for safeguarding your credentials. You must provide accurate
          information and keep it current.
        </p>
      </section>

      <section>
        <h2 id="as-is" className="mt-10 text-base">
          3. Service provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
        </h2>
        <p>
          The Service is provided on an <strong>&quot;AS IS&quot;</strong> and{" "}
          <strong>&quot;AS AVAILABLE&quot;</strong> basis. We are a young,
          bootstrapped platform and <strong>do not guarantee</strong> that the
          Service will be uninterrupted, error-free, secure, or free of harmful
          components. We do not warrant that any particular feature (including APIs,
          maps, search, estimates, or experimental tools) will meet your
          requirements or produce accurate or complete results.
        </p>
        <p>
          <strong>
            To the fullest extent permitted by law, we disclaim all warranties,
            whether express, implied, or statutory
          </strong>
          , including implied warranties of merchantability, fitness for a
          particular purpose, title, and non-infringement, except where such
          disclaimers are prohibited by law.
        </p>
      </section>

      <section>
        <h2 id="liability" className="mt-10 text-base">
          4. Limitation of liability
        </h2>
        <p>
          <strong>To the maximum extent permitted by law:</strong>
        </p>
        <ul>
          <li>
            <strong>
              We are not liable for any indirect, incidental, special,
              consequential, exemplary, or punitive damages
            </strong>
            , or for any loss of profits, revenue, goodwill, data, or business
            opportunities, even if we have been advised of the possibility of such
            damages.
          </li>
          <li>
            <strong>
              Our total aggregate liability for any claim arising out of or
              relating to the Service or these Terms
            </strong>{" "}
            will not exceed the greater of{" "}
            <strong>one hundred U.S. dollars (US$100)</strong> or the amounts you
            paid us for the Service in the twelve (12) months before the event giving
            rise to the claim. If you only use free offerings and paid us nothing in
            that period, that amount is <strong>zero</strong>, and the cap is{" "}
            <strong>US$100</strong> unless applicable law requires a lower cap.
          </li>
        </ul>
        <p>
          Some jurisdictions do not allow certain limitations; in those
          jurisdictions, our liability is limited to the minimum permitted by law.
        </p>
      </section>

      <section>
        <h2 id="api" className="mt-10 text-base">
          5. API keys, developer access, and acceptable use
        </h2>
        <p>
          API keys and developer access are <strong>revocable privileges</strong>,
          not property rights. We may suspend or terminate access, revoke API keys,
          or limit functionality <strong>at any time</strong>, with or without
          notice, including for security, abuse prevention, legal compliance, or
          operational reasons.
        </p>
        <h3 className="text-sm">You agree not to:</h3>
        <ul>
          <li>
            Circumvent authentication, rate limits, quotas, or technical
            restrictions we impose.
          </li>
          <li>
            Use the Service to build or operate a product that primarily{" "}
            <strong>scrapes, re-hosts, or mirrors</strong> our marketplace data in
            a way that competes with or substitutes for the Service without adding
            substantial independent value, as we reasonably determine.
          </li>
          <li>
            Use the Service in any manner that could damage, disable, overburden, or
            impair our systems or other users&apos; experience.
          </li>
        </ul>
        <p>
          We may <strong>throttle, rate-limit, or cap</strong> requests to protect
          infrastructure and users. Those limits may change without notice.
        </p>
      </section>

      <section>
        <h2 id="content" className="mt-10 text-base">
          6. User content and data ownership
        </h2>
        <p>
          As between you and OES, <strong>you retain ownership</strong> of your User
          Content (for example, listing descriptions and photos you upload). To
          operate the Service, you grant OES a{" "}
          <strong>
            non-exclusive, worldwide, royalty-free license
          </strong>{" "}
          to host, store, reproduce, display, distribute, and otherwise use your User
          Content solely to provide, improve, and promote the Service and as
          described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          You represent that you have the rights necessary to grant the foregoing
          license and that your content does not violate third-party rights or
          applicable law.
        </p>
      </section>

      <section>
        <h2 id="developers" className="mt-10 text-base">
          7. Developers and end-user data
        </h2>
        <p>
          If you build an application or integration that collects personal data
          from end users, <strong>you are solely responsible</strong> for your own
          legal compliance, including maintaining a clear and accurate{" "}
          <strong>privacy policy</strong> for your product and obtaining any
          required consents. Your use of our APIs does not make us responsible for
          how you process your users&apos; data.
        </p>
      </section>

      <section>
        <h2 id="ip" className="mt-10 text-base">
          8. Intellectual property and brand
        </h2>
        <p>
          The Service, excluding your User Content, including software, branding,
          logos, and documentation, is owned by OES or our licensors. These Terms
          do not grant you any rights in our trademarks (including &quot;Open Estate
          Sales&quot; and related marks) except the limited right to use them in
          good faith to identify compatibility—
          <strong>
            you may not imply endorsement, partnership, or affiliation
          </strong>{" "}
          where none exists, or use our marks as the primary branding of your
          product.
        </p>
      </section>

      <section>
        <h2 id="open-source" className="mt-10 text-base">
          9. Open source software and the hosted Service
        </h2>
        <p>
          Portions of our codebase may be published under the{" "}
          <strong>GNU Affero General Public License v3.0 (&quot;AGPL-3.0&quot;)</strong>
          . Your use of that <strong>source code</strong> is governed by the
          AGPL-3.0, a copyleft license that applies to software you receive under it.
        </p>
        <p>
          <strong>
            The AGPL-3.0 does not govern your use of our hosted websites, APIs, or
            other online services.
          </strong>{" "}
          Access to the live Service, API keys, and production infrastructure is
          governed by <strong>these Terms</strong> and our policies, regardless of
          how our software is licensed in the repository.
        </p>
      </section>

      <section>
        <h2 id="indemnity" className="mt-10 text-base">
          10. Indemnity
        </h2>
        <p>
          To the extent permitted by law, you will defend and indemnify OES and its
          contributors against claims, damages, and expenses (including reasonable
          attorneys&apos; fees) arising from your User Content, your misuse of the
          Service, or your violation of these Terms or applicable law.
        </p>
      </section>

      <section>
        <h2 id="changes" className="mt-10 text-base">
          11. Changes
        </h2>
        <p>
          We may modify these Terms by posting an updated version and updating the
          &quot;Last updated&quot; date. Material changes may be communicated through
          the Service or by email where appropriate. Continued use after changes
          become effective constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 id="general" className="mt-10 text-base">
          12. General
        </h2>
        <p>
          These Terms constitute the entire agreement regarding the subject matter
          here. If a provision is unenforceable, the remainder remains in effect.
          Failure to enforce a provision is not a waiver.
        </p>
        <p>
          For claims not subject to arbitration (if any), you agree that the laws
          of the <strong>United States</strong> and the{" "}
          <strong>State of Delaware</strong> govern these Terms, excluding
          conflict-of-law rules, and that state and federal courts located in Delaware
          have
          personal jurisdiction—subject to any consumer protections in your home
          jurisdiction that cannot be waived.
        </p>
      </section>

      <section>
        <h2 id="contact" className="mt-10 text-base">
          13. Contact
        </h2>
        <p>
          Questions about these Terms: use the contact channels listed on{" "}
          <Link href="/">openestatesales.com</Link> or open an issue in our public
          repository where appropriate.
        </p>
      </section>

      <p className="border-t border-border pt-8 text-xs text-muted-foreground">
        This page is meant to describe how we intend to operate the Service. It is
        not legal advice; consider consulting qualified counsel for your situation.
      </p>
    </LegalPageShell>
  );
}
