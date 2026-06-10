type Props = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-[var(--user-bubble)] text-white"
            : "rounded-bl-md bg-[var(--ai-bubble)] text-[var(--text)]"
        }`}
      >
        {!isUser && (
          <span className="mb-1 block text-xs font-semibold text-[var(--accent)]">
            AI
          </span>
        )}
        {content}
      </div>
    </div>
  );
}
