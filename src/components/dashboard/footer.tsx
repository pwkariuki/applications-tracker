import { GitHubLogo } from "@/components/dashboard/icons/github-logo";

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Built by Patrick Kariuki
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a
            href="https://github.com/pwkariuki/applications-tracker"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <GitHubLogo className="h-4 w-4" />
            GitHub
          </a>
          <span>Convex + React</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
