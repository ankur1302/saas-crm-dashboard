export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 rounded-xl bg-zinc-200 dark:bg-zinc-800"
                    />
                ))}
            </div>
            <div className="h-96 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
    );
}
