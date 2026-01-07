import {
    LucideProps,
    Facebook,
    Loader2,
    // ... other icons from lucide
    Chrome
} from "lucide-react"

export const Icons = {
    spinner: Loader2,
    facebook: Facebook,
    google: (props: LucideProps) => (
        <svg role="img" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.147-1.133 8.213-3.293 2.067-2.16 2.68-5.453 2.68-6.16 0-.613-.027-1.173-.08-1.707H12.48z"
            />
        </svg>
    ),
}
