
interface TranslationHeaderProps {
  className?: string;
}

export default function TranslationHeader({ className = "" }: TranslationHeaderProps) {
  return (
    <div className={`mb-4 sm:mb-6 px-1 ${className}`}>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Real-time Translation
      </h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
        Support for over 90 languages with text-to-speech functionality.
      </p>
    </div>
  );
}
