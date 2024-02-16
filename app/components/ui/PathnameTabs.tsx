import { cn } from "@/utils/utils";
import { Link, UseLinkPropsOptions, useRouterState } from "@tanstack/react-router";

export const PathnameTabs = ({
	tabs,
}: {
	tabs: {
		label: string;
		href: UseLinkPropsOptions["to"];
	}[];
}) => {
	const routerState = useRouterState();

	return (
		<div className="flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground sm:w-auto sm:max-w-min">
			{tabs.map(({ href, label }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						"inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
						routerState.location === href && "bg-background text-foreground shadow-sm"
					)}
				>
					{label}
				</Link>
			))}
		</div>
	);
};
