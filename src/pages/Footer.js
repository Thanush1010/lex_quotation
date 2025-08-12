

function Footer() {
	return (
		<footer
			className="py-8 mt-12 flex flex-col items-center gap-2 shadow-inner"
			style={{
				background: 'linear-gradient(90deg, #6A89A7 0%, #BDDDFC 50%, #88BDF2 100%)',
				color: '#384959',
			}}
		>
			<div className="font-bold text-lg tracking-wide" style={{ color: '#384959' }}>AutoIP</div>
			<div className="text-sm opacity-90" style={{ color: '#384959' }}>Effortless Patent Document Automation</div>
			<div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center mt-2">
				<span className="opacity-80" style={{ color: '#384959' }}>&copy; {new Date().getFullYear()} AutoIP. All rights reserved.</span>
				<span className="hidden md:inline-block" style={{ color: '#384959' }}>|</span>
				<a
					href="mailto:support@autoip.com"
					className="hover:underline"
					style={{ color: '#6A89A7' }}
				>
					Contact Us
				</a>
			</div>
		</footer>
	);
}

export default Footer;
