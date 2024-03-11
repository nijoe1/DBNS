export function HowItWorks({ steps }: { steps: any[] }): JSX.Element {
  return (
    <section className="py-10" id="how-it-works">
      <header className="text-center font-bold my-5">
        <p className="text-md text-muted-foreground/60">How it works</p>
        <h1 className="text-4xl text-primary font-extrabold">
          Step-by-step guide
        </h1>
      </header>
      <div className="grid max-w-[900px] mx-auto">
        {steps.map((step, index) => (
          <StepElement
            key={index}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function StepElement({
  step,
  index,
  isLast,
}: {
  step: any;
  index: number;
  isLast?: boolean;
}): JSX.Element {
  return (
    <div className="flex ">
      <div className="flex flex-col items-center mr-6">
        {index === 0 && <div className="w-px h-10 opacity-0 sm:h-full" />}
        {index > 0 && !isLast && (
          <div className="w-px h-[30px] sm:h-1/2 bg-gray-300" />
        )}
        {isLast && <div className="w-px h-[30px] sm:h-1/3 bg-gray-300" />}
        <div>
          <div className="flex items-center justify-center w-8 h-8 text-xs font-medium border rounded-full">
            {index + 1}
          </div>
        </div>
        {index === 0 ? (
          <div className="w-px h-full bg-gray-300" />
        ) : (
          !isLast && <div className="w-px h-4/5 sm:h-1/2 bg-gray-300" />
        )}
      </div>
      <div className="flex flex-col pb-6 sm:items-center sm:flex-row sm:pb-0 show">
        <div className="sm:mr-5">
          <div className="flex items-center justify-center w-16 h-16 my-3 rounded-full bg-indigo-50 sm:w-24 sm:h-24">
            {step.icon}
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-base text-primary font-bold">
            {step.title}
          </h1>
          <p className="text-sm text-gray-700 pr-2">{step.description}</p>
        </div>
      </div>
    </div>
  );
}
