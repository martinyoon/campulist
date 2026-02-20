'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ReportReason } from '@/lib/types';

interface ReportDialogProps {
  postId: string;
  onClose: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: '스팸/광고' },
  { value: 'fraud', label: '사기 의심' },
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'duplicate', label: '중복 게시글' },
  { value: 'other', label: '기타' },
];

export default function ReportDialog({ postId, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!reason) return;
    // Phase A: Mock 신고 처리
    console.log('신고 접수:', { postId, reason, description });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="mx-4 w-full max-w-sm rounded-xl bg-background p-6 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-4xl">✅</div>
          <h3 className="mt-3 text-lg font-bold">신고가 접수되었습니다</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            검토 후 조치하겠습니다. 감사합니다.
          </p>
          <Button onClick={onClose} className="mt-4 w-full">확인</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-xl bg-background p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold">게시글 신고</h3>
        <p className="mt-1 text-sm text-muted-foreground">신고 사유를 선택해주세요</p>

        <div className="mt-4 space-y-2">
          {REPORT_REASONS.map(r => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                reason === r.value
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {reason === 'other' && (
          <textarea
            placeholder="구체적인 사유를 입력해주세요"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )}

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">취소</Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            신고하기
          </Button>
        </div>
      </div>
    </div>
  );
}
