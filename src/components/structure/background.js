const Background = ({children}) => {
    return (
        // Remove transition-all to disable the background color transition.
        <body className="bg-custom-pink-a dark:bg-custom-gray-b transition-all">
        {children}
        </body>
    )
}

export default Background;