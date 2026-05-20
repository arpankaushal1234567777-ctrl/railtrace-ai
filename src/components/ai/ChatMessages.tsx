interface Message {
  role: string;
  content: string;
}

interface Props {
  messages: Message[];
}

export default function ChatMessages({
  messages,
}: Props) {
  if (!messages.length) return null;

  return (
    <div className="rt-chat-wrap">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`rt-chat-bubble ${
            msg.role === "user"
              ? "user"
              : "assistant"
          }`}
        >
          <span className="rt-chat-role">
            {msg.role === "user"
              ? "You"
              : "RailTrace AI"}
          </span>

          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
}