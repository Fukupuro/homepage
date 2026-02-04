type Props = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
};

export default function SearchForm({ value, onChange, onSubmit }: Props) {
	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		onSubmit();
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
			<label htmlFor="blog-search" className="sr-only">
				記事を検索
			</label>
			<input
				id="blog-search"
				type="search"
				name="q"
				value={value}
				onChange={(event) => onChange(event.currentTarget.value)}
				placeholder="記事を検索"
				className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-sm text-white hover:bg-blue-700"
			>
				検索
			</button>
		</form>
	);
}
