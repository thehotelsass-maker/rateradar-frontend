import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Star, MessageSquareHeart, RefreshCw } from "lucide-react";
import { useHotel } from "../../context/HotelContext";
import { socket } from "../../lib/socket";
import api from "../../lib/api";

// Yulduzlar qatori
function Stars({ value, size = 15 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= value ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

const fmtDate = (d) =>
  new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

export default function ReviewsPage() {
  const { t } = useOutletContext();
  const { hotel } = useHotel();

  const [items, setItems] = useState([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/hotel/reviews");
      setItems(data.data || []);
      setAvg(data.avg_rating || 0);
      setTotal(data.total || 0);
    } catch {
      /* sukut */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Jonli yangi sharhlar
    const onNew = ({ review }) => {
      if (!review) return;
      setItems((p) => [review, ...p]);
      setTotal((n) => n + 1);
    };
    socket.on("new_review", onNew);
    return () => socket.off("new_review", onNew);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel?.hotel_id]);

  // O'rtacha bahoga qarab rang
  const avgColor = avg >= 4 ? "text-green-600" : avg >= 3 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquareHeart size={20} className="text-blue-600" /> {t("reviewsTitle")}
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">{t("reviewsDesc")}</p>
        </div>
        <button onClick={load} className="btn-ghost" title={t("refresh")}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="card p-5 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${avgColor}`}>{avg ? avg.toFixed(1) : "—"}</div>
          <Stars value={Math.round(avg)} size={16} />
          <p className="text-xs text-gray-400 mt-1.5">{t("avgRating")}</p>
        </div>
        <div className="card p-5 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">{total}</div>
          <p className="text-xs text-gray-400 mt-1.5">{t("totalReviews")}</p>
        </div>
      </div>

      {/* Ro'yxat */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">{t("noReviews")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <Stars value={r.rating} />
                  <span className="text-xs font-semibold text-gray-500">
                    {r.room_number ? `${t("roomNum")} ${r.room_number}` : t("anonymous")}
                  </span>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.created_at)}</span>
              </div>
              {(r.comment_translated || r.comment) && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {r.comment_translated || r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
