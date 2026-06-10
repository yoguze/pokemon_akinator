import Image from "next/image";

type Props = {
  nameJa: string;
  nameEn: string;
  imageUrl: string;
  types: string[];
  id: number;
};

export function VictoryCard({ nameJa, nameEn, imageUrl, types, id }: Props) {
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-xl">
      <p className="mb-1 text-sm font-semibold text-[var(--success)]">
        正解！
      </p>
      <h2 className="text-2xl font-bold text-[var(--accent)]">{nameJa}</h2>
      <p className="text-sm text-[var(--text-muted)]">{nameEn}</p>
      <div className="mt-4 flex justify-center">
        <Image
          src={imageUrl}
          alt={nameJa}
          width={160}
          height={160}
          className="drop-shadow-lg"
          unoptimized
        />
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        図鑑 No.{id} · {types.join(" / ")}
      </p>
    </div>
  );
}
