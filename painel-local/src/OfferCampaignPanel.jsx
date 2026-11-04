import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  Monitor,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  campaignIssues,
  campaignPreview,
  productCategories,
  productDraftIssues,
  productIssues,
} from "../../bom-pra-voce-novo/src/Components/ProductOffers/model";
import {
  productBarcodes,
  productDescription,
  productFragrances,
} from "../../bom-pra-voce-novo/src/Components/ProductOffers/productIdentity";
import { prepareNovemberCampaigns } from "../../bom-pra-voce-novo/src/Components/ProductOffers/novemberCampaign";
import {
  seasonalTheme,
  seasonalThemes,
} from "../../bom-pra-voce-novo/src/Components/Tabloide/seasonalThemes";
import {
  emptyWorkspace,
  loadWorkspace,
  readProductImage,
  saveWorkspace,
} from "./services/productDrafts";
import { panelErrorMessage } from "./services/diagnostics";
import { requireSensitiveAction } from "./services/sensitiveAction";
import CampaignItemsTable from "./CampaignItemsTable";
import ProductPreview from "./ProductPreview";
import ProductPublication from "./ProductPublication";
import SeasonalThemePicker from "./SeasonalThemePicker";
import "./OfferCampaignPanel.css";
import "./OfferCampaignDesktop.css";
import "./ProductEditor.css";

const FORM_DRAFT = "bpv-product-form-draft-v1";
const PHOTO_REVIEW_SESSION_MS = 10 * 60 * 1000;
const PRODUCTS_PAGE_SIZE = 8;
const IMAGE_SOURCE_OPTIONS = [
  "Inteligência artificial",
  "Fornecedor ou fabricante",
  "Foto própria",
  "Banco de imagens licenciado",
];
const blankProduct = () => ({
  id: crypto.randomUUID(),
  revision: 0,
  name: "",
  code: "",
  barcode: "",
  fragrances: [],
  identifierType: "gtin",
  noGtinReason: "",
  brand: "",
  variant: "",
  content: "",
  category: "mercearia",
  image: "",
  imageSource: "",
  imageAuthorized: false,
  imageApproved: false,
});
const normalizeProductDraft = (product) => ({
  ...product,
  fragrances:
    Array.isArray(product?.fragrances) &&
    product.fragrances.some((item) => item.name?.trim() || item.barcode?.trim())
      ? product.fragrances
      : [],
});
const blankCampaign = () => ({
  id: crypto.randomUUID(),
  title: "Nova campanha",
  campaignType: "seasonal",
  theme_key: "padrao",
  startDate: "",
  endDate: "",
  conditions: "Enquanto durarem os estoques.",
  items: [],
});
const comparable = (value) => JSON.stringify({ ...value, revision: 0 });
const day = (value) =>
  value ? value.split("-").reverse().join("/") : "A definir";
const overlaps = (a, b) =>
  a.id !== b.id &&
  a.startDate &&
  a.endDate &&
  b.startDate &&
  b.endDate &&
  a.startDate <= b.endDate &&
  b.startDate <= a.endDate;
const monthTitle = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(`${value}-01T12:00:00-03:00`));

function useLocalWorkspace() {
  const [workspace, setWorkspace] = useState(emptyWorkspace),
    [loaded, setLoaded] = useState(false),
    [saveState, setSaveState] = useState({
      status: "loading",
      savedAt: null,
      error: "",
    });
  const workspaceRef = useRef(workspace),
    persistedRef = useRef(""),
    chainRef = useRef(Promise.resolve()),
    timerRef = useRef(null),
    mountedRef = useRef(true);
  const replace = useCallback((next) => {
    workspaceRef.current = next;
    setWorkspace(next);
  }, []);
  useEffect(() => {
    loadWorkspace()
      .then((data) => {
        workspaceRef.current = data;
        persistedRef.current = comparable(data);
        setWorkspace(data);
        setLoaded(true);
        setSaveState({ status: "saved", savedAt: null, error: "" });
      })
      .catch((error) =>
        setSaveState({
          status: "error",
          savedAt: null,
          error: panelErrorMessage("product-drafts-load", error),
        }),
      );
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, []);
  const persist = useCallback(() => {
    const operation = chainRef.current
      .catch(() => {})
      .then(async () => {
        const snapshot = workspaceRef.current;
        if (comparable(snapshot) === persistedRef.current) return snapshot;
        if (mountedRef.current)
          setSaveState((state) => ({ ...state, status: "saving", error: "" }));
        try {
          const saved = await saveWorkspace(snapshot);
          persistedRef.current = comparable(saved);
          const next = { ...workspaceRef.current, revision: saved.revision };
          workspaceRef.current = next;
          if (mountedRef.current) {
            setWorkspace(next);
            setSaveState({ status: "saved", savedAt: new Date(), error: "" });
          }
          return next;
        } catch (error) {
          const message = panelErrorMessage("product-drafts-save", error);
          if (mountedRef.current)
            setSaveState((state) => ({
              ...state,
              status: "error",
              error: message,
            }));
          throw error;
        }
      });
    chainRef.current = operation;
    return operation;
  }, []);
  useEffect(() => {
    if (!loaded || comparable(workspace) === persistedRef.current) return;
    clearTimeout(timerRef.current);
    setSaveState((state) => ({ ...state, status: "pending", error: "" }));
    timerRef.current = setTimeout(() => persist().catch(() => {}), 500);
    return () => clearTimeout(timerRef.current);
  }, [workspace, loaded, persist]);
  useEffect(() => {
    window.panelWindow?.setCloseState(saveState.status);
  }, [saveState.status]);
  return { workspace, workspaceRef, replace, persist, loaded, saveState };
}

function SaveStatus({ state, onRetry }) {
  const label =
    state.status === "saving"
      ? "Salvando…"
      : state.status === "pending"
        ? "Salvamento automático pendente"
        : state.status === "error"
          ? "Não foi possível salvar"
          : state.savedAt
            ? `Salvo neste computador às ${state.savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
            : "Salvo neste computador";
  return (
    <div className={`offer-save offer-save--${state.status}`} role="status">
      {state.status === "error" ? (
        <TriangleAlert size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}
      <span>{label}</span>
      {state.status === "error" && (
        <button onClick={onRetry}>Tentar novamente</button>
      )}
    </div>
  );
}
function Steps({ step }) {
  return (
    <ol className="offer-steps" aria-label="Etapas da campanha">
      {["Produtos", "Conferência", "Publicação"].map((label, index) => (
        <li
          className={
            step === index + 1 ? "active" : step > index + 1 ? "done" : ""
          }
          key={label}
        >
          <span>{step > index + 1 ? "✓" : index + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function CampaignList({ workspace, onOpen, onPrepare, onNew, onCatalog }) {
  const campaigns = [...workspace.campaigns].sort((a, b) =>
    (a.startDate || "").localeCompare(b.startDate || ""),
  );
  return (
    <div className="offer-page">
      <header className="offer-page-head offer-page-head--list">
        <div><h1>Campanhas</h1><p>Novembro de 2026</p></div>
        {!campaigns.length && <button className="offer-primary" onClick={onPrepare}>Preparar novembro</button>}
      </header>
      <div className="offer-warning">
        <Clock3 /><strong>Estado no site ainda não conferido.</strong>
        <button className="offer-secondary">Conferir no site</button>
      </div>
      <div className="offer-campaigns">
        {campaigns.map((c) => {
          const theme = seasonalTheme(c.theme_key);
          return (
            <article className="offer-campaign-card" key={c.id}>
              {theme && <img src={theme.thumbnail} alt="" />}
              <div className="offer-campaign-copy">
                <h2>{c.title}</h2>
                <p>
                  <CalendarDays /> {day(c.startDate)} a {day(c.endDate)}
                </p>
                <span className="offer-badge"><FileText size={17}/> Rascunho local</span>
              </div>
              <button className="offer-primary" onClick={() => onOpen(c.id)}>
                Abrir campanha <ArrowRight />
              </button>
            </article>
          );
        })}
        {!campaigns.length && (
          <div className="offer-empty">
            <Tag />
            <h2>Nenhuma campanha local</h2>
            <p>Prepare novembro ou crie uma campanha usando um tema pronto.</p>
          </div>
        )}
      </div>
      <footer className="offer-page-footer">
        <div>
          <h2>Outras campanhas</h2>
          <p>Explore nosso catálogo de temas prontos e crie novas campanhas quando quiser.</p>
        </div>
        <div>
          <button className="offer-secondary" onClick={onNew}>Ver catálogo de temas prontos <ArrowRight/></button>
        </div>
      </footer>
    </div>
  );
}

function CampaignEditor({
  campaign,
  catalog,
  campaigns,
  onChange,
  onCatalog,
  onEdit,
  onMove,
  onReview,
  onBack,
  saveState,
  onRetry,
  onReviewPhoto,
  focusTarget,
  onFocusHandled,
}) {
  const theme = seasonalTheme(campaign.theme_key),
    conflicts = campaigns.filter((other) => overlaps(campaign, other));
  return (
    <div className="offer-page">
      <div className="offer-breadcrumb"><button onClick={onBack}>Campanhas</button><span>/</span><strong>{campaign.title.split(" ")[0]}</strong></div>
      <header className="offer-campaign-head">
        <div>
          {theme && <img src={theme.desktop} alt="" />}
          <div>
            <h1>{campaign.title}</h1>
            <p>
              <CalendarDays /> {day(campaign.startDate)} a{" "}
              {day(campaign.endDate)}
            </p>
            <SaveStatus state={saveState} onRetry={onRetry} />
          </div>
        </div>
        <Steps step={1} />
      </header>
      <section
        className="offer-settings offer-settings--open offer-settings--campaign"
        aria-labelledby="campaign-data-title"
      >
        <h2 id="campaign-data-title">Dados da campanha</h2>
        <div className="offer-form-grid">
          <label>
            Nome operacional
            <input
              value={campaign.title}
              maxLength={120}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </label>
          <label>
            Tipo de campanha
            <select
              value={campaign.campaignType || "seasonal"}
              onChange={(e) => onChange({ campaignType: e.target.value })}
            >
              <option value="weekly">Oferta semanal</option>
              <option value="seasonal">Campanha sazonal</option>
              <option value="commercial">Data comercial</option>
              <option value="institutional">Campanha institucional</option>
            </select>
            <small>Define a finalidade, não a aparência.</small>
          </label>
          <label>
            Início da campanha
            <input
              type="date"
              value={campaign.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
            <small>Horário de Brasília · início às 00h</small>
          </label>
          <label>
            Fim da campanha
            <input
              type="date"
              value={campaign.endDate}
              min={campaign.startDate || undefined}
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
            <small>Dia final incluído</small>
          </label>
          <label className="wide">
            Condições
            <textarea
              value={campaign.conditions}
              onChange={(e) => onChange({ conditions: e.target.value })}
            />
          </label>
          <div className="wide">
            <SeasonalThemePicker
              value={campaign.theme_key}
              onChange={(theme_key) => onChange({ theme_key })}
            />
          </div>
        </div>
        {conflicts.length > 0 && (
          <div className="offer-error">
            <TriangleAlert />
            <div>
              <strong>Conflito de período no planejamento</strong>
              <p>
                Este rascunho se sobrepõe a{" "}
                {conflicts
                  .map(
                    (c) =>
                      `${c.title} (${day(c.startDate)} a ${day(c.endDate)})`,
                  )
                  .join(", ")}
                . A publicação será bloqueada enquanto houver sobreposição.
              </p>
            </div>
          </div>
        )}
        <p className="offer-help">
          Salvar o rascunho não publica. O tipo e o tema são independentes:
          campanhas do mesmo tipo podem usar temas diferentes.
        </p>
      </section>
      <section className="offer-section-head">
        <div>
          <h2>Produtos da campanha</h2>
          <p>
            Adicione os produtos que farão parte desta campanha.
          </p>
        </div>
        <button className="offer-primary" onClick={onCatalog}>
          <Plus /> Adicionar produtos
        </button>
        <button className="offer-secondary" onClick={onReview}>
          Conferir campanha <ArrowRight />
        </button>
      </section>
      <CampaignItemsTable
        campaign={campaign}
        catalog={catalog}
        onChange={onChange}
        onAdd={onCatalog}
        onEdit={onEdit}
        onMove={onMove}
        onReviewPhoto={onReviewPhoto}
        focusTarget={focusTarget}
        onFocusHandled={onFocusHandled}
      />
      <section className="offer-period-summary">
        <div><h2>Período e condições</h2><strong>Período da campanha</strong><p><CalendarDays/> {day(campaign.startDate)} <span>a</span> <CalendarDays/> {day(campaign.endDate)}</p></div>
        <div><strong>Condições</strong><p>{campaign.conditions || "Defina os produtos, preços e unidades de venda que farão parte desta campanha."}</p></div>
      </section>
      <div className="offer-computer-note"><Monitor/> Alterações são salvas automaticamente neste computador. Publicar exige confirmação.</div>
    </div>
  );
}

function CampaignCalendar({ campaigns, onOpen, onNew }) {
  const first =
    campaigns.find((c) => c.startDate)?.startDate?.slice(0, 7) ||
    new Date()
      .toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
      .slice(0, 7);
  const [month, setMonth] = useState(first);
  const shift = (delta) => {
    const date = new Date(`${month}-01T12:00:00-03:00`);
    date.setMonth(date.getMonth() + delta);
    setMonth(date.toISOString().slice(0, 7));
  };
  const visible = [...campaigns]
    .filter(
      (c) =>
        c.startDate?.slice(0, 7) === month ||
        c.endDate?.slice(0, 7) === month ||
        (c.startDate < `${month}-01` && c.endDate >= `${month}-01`),
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return (
    <div className="offer-page offer-calendar">
      <header className="offer-page-head">
        <div>
          <h1>Calendário de campanhas</h1>
          <p>Planejamento por datas · Horário de Brasília</p>
        </div>
        <button className="offer-primary" onClick={() => onNew(`${month}-01`)}>
          <Plus /> Criar rascunho
        </button>
      </header>
      <div className="calendar-controls">
        <button aria-label="Mês anterior" onClick={() => shift(-1)}>
          <ArrowLeft />
        </button>
        <h2>{monthTitle(month)}</h2>
        <button
          onClick={() =>
            setMonth(
              new Date()
                .toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
                .slice(0, 7),
            )
          }
        >
          Hoje
        </button>
        <button aria-label="Próximo mês" onClick={() => shift(1)}>
          <ArrowRight />
        </button>
      </div>
      <div className="calendar-layout">
        <section
          className="calendar-list"
          aria-label={`Campanhas de ${monthTitle(month)}`}
        >
          {visible.map((c) => {
            const conflicts = campaigns.filter((other) => overlaps(c, other));
            return (
              <article
                key={c.id}
                className={conflicts.length ? "has-conflict" : ""}
              >
                <div>
                  <span className="offer-badge">Rascunho</span>
                  <strong>{c.title}</strong>
                  <p>
                    {day(c.startDate)} a {day(c.endDate)} ·{" "}
                    {seasonalTheme(c.theme_key)?.label || "Tema a definir"}
                  </p>
                  {conflicts.length > 0 && (
                    <small>
                      <TriangleAlert /> Conflito com{" "}
                      {conflicts.map((x) => x.title).join(", ")}
                    </small>
                  )}
                </div>
                <button
                  className="offer-secondary"
                  onClick={() => onOpen(c.id)}
                >
                  Abrir campanha <ChevronRight />
                </button>
              </article>
            );
          })}
          {!visible.length && (
            <div className="offer-empty">
              <CalendarDays />
              <h2>Nenhuma campanha neste mês</h2>
              <p>Crie um rascunho para começar o planejamento.</p>
            </div>
          )}
        </section>
        <aside className="calendar-legend">
          <h2>Legenda</h2>
          {[
            "Rascunho · em edição",
            "Agendada · publicação confirmada",
            "Ativa · vigente no servidor",
            "Encerrada · período finalizado",
            "Retirada · fora da vitrine",
            "Conflito · períodos sobrepostos",
          ].map((label) => (
            <p key={label}>{label}</p>
          ))}
          <small>O estado local não comprova publicação no site.</small>
        </aside>
      </div>
    </div>
  );
}

function Catalog({ catalog, campaign, onInclude, onEdit, onNew, onBack, onReviewPhoto }) {
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState([]),
    [listText, setListText] = useState(""),
    [page, setPage] = useState(1);
  const q = query.trim().toLocaleLowerCase("pt-BR");
  const visible = catalog.filter((p) =>
    [p.name, p.code, p.brand, ...productBarcodes(p)].some((value) =>
      value?.toLocaleLowerCase("pt-BR").includes(q),
    ),
  );
  const available = visible.filter(
    (p) => !campaign?.items.some((i) => i.productId === p.id),
  );
  const pageCount = Math.max(1, Math.ceil(visible.length / PRODUCTS_PAGE_SIZE));
  const pagedVisible = visible.slice((page - 1) * PRODUCTS_PAGE_SIZE, page * PRODUCTS_PAGE_SIZE);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  useEffect(() => setPage(1), [campaign?.id]);
  const listEntries = listText
    .split(/[\n;,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const normalized = (value) => value.trim().toLocaleLowerCase("pt-BR");
  const listMatches = listEntries.map((entry) => {
    const key = normalized(entry);
    const matches = catalog.filter((product) =>
      [product.name, product.code, ...productBarcodes(product)].some(
        (value) => normalized(value || "") === key,
      ),
    );
    const product = matches.length === 1 ? matches[0] : null;
    const reason =
      matches.length > 1
        ? "Código ou nome ambíguo"
        : !product
          ? "Não encontrado"
          : campaign?.items.some((item) => item.productId === product.id)
            ? "Já está na campanha"
            : productIssues(product).length
              ? "Cadastro precisa de revisão"
              : "Pronto";
    return { entry, product, reason };
  });
  const listProductIds = [
    ...new Set(
      listMatches
        .filter((item) => item.reason === "Pronto")
        .map((item) => item.product.id),
    ),
  ];
  return (
    <div className="offer-page">
      <div className="offer-context">
        {campaign ? (
          <>
            <Package />
            <span>
              Adicionando produtos ao <strong>{campaign.title}</strong>
            </span>
            <button className="offer-secondary" onClick={onBack}>
              Voltar à campanha
            </button>
          </>
        ) : (
          <span>Catálogo local de produtos</span>
        )}
      </div>
      <header className="offer-page-head">
        <div>
          <h1>Produtos</h1>
          <p>Seu catálogo, independente das campanhas.</p>
        </div>
        <button className="offer-primary" onClick={onNew}>
          <Plus /> Cadastrar produto
        </button>
      </header>
      {campaign && (
        <details className="offer-list-import">
          <summary>Incluir produtos por lista</summary>
          <p>
            Cole um nome exato, código interno ou GTIN por linha. O painel
            confere a lista antes de incluir.
          </p>
          <label>
            Lista de produtos
            <textarea
              value={listText}
              onChange={(event) => setListText(event.target.value)}
              placeholder={"7897534800212\n7897534828568\nNome exato do produto"}
            />
          </label>
          {listEntries.length > 0 && (
            <div className="offer-list-results" aria-live="polite">
              {listMatches.map((item, index) => (
                <span
                  className={item.reason === "Pronto" ? "ok" : "review"}
                  key={`${item.entry}-${index}`}
                >
                  <strong>{item.entry}</strong>
                  {item.product && item.product.name !== item.entry
                    ? ` · ${item.product.name}`
                    : ""}
                  <small>{item.reason}</small>
                </span>
              ))}
            </div>
          )}
          <button
            className="offer-primary"
            disabled={!listProductIds.length}
            onClick={() => {
              onInclude(listProductIds);
              setListText("");
            }}
          >
            Incluir {listProductIds.length || ""} produto
            {listProductIds.length === 1 ? "" : "s"} da lista <ArrowRight />
          </button>
        </details>
      )}
      <label className="offer-search">
        <Search />
        <span className="sr-only">Buscar por nome, código ou GTIN</span>
        <input
          placeholder="Buscar por nome, código ou GTIN"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
      </label>
      <div className="offer-catalog">
        <div className="offer-catalog-header">
          <span></span>
          <span>Produto</span>
          <span>Código</span>
          <span>Foto</span>
          <span>Ações</span>
        </div>
        {pagedVisible.map((p) => {
          const alreadyAdded = Boolean(campaign?.items.some((i) => i.productId === p.id));
          return <article key={p.id}>
            <input
              type="checkbox"
              aria-label={`Selecionar ${p.name}`}
              disabled={
                !campaign ||
                productIssues(p).length > 0 ||
                alreadyAdded
              }
              checked={selected.includes(p.id)}
              onChange={(e) =>
                setSelected(
                  e.target.checked
                    ? [...selected, p.id]
                    : selected.filter((id) => id !== p.id),
                )
              }
            />
            <div>
              <strong>{productDescription(p)}</strong>
              <small>{p.brand || "Marca não informada"}</small>
            </div>
            <div>
              {p.code}
              <small>{productBarcodes(p).join(" / ") || "Sem GTIN"}</small>
            </div>
            <div className="offer-photo-cell">
              {p.image ? <img src={p.image} alt="" /> : <ImageIcon />}
              <span className={alreadyAdded ? "added" : productIssues(p).length ? "review" : "ok"}>
                {alreadyAdded ? "Já adicionado" : productIssues(p).length ? "Revisar cadastro" : "Conferido"}
              </span>
            </div>
            <div className="offer-catalog-actions">
              {!p.imageApproved && p.image && <button className="offer-secondary" onClick={() => onReviewPhoto(p)}>Conferir imagem</button>}
              <button className="offer-secondary" onClick={() => onEdit(p)}>Editar</button>
            </div>
          </article>;
        })}
        {!visible.length && (
          <div className="offer-empty">
            <Package />
            <h2>Nenhum produto encontrado</h2>
            <button className="offer-secondary" onClick={() => setQuery("")}>
              Limpar busca
            </button>
          </div>
        )}
        {pageCount > 1 && <nav className="offer-pagination" aria-label="Paginação do catálogo de produtos"><button type="button" className="offer-secondary" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Anterior</button><span aria-live="polite">Página {page} de {pageCount}</span><button type="button" className="offer-secondary" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Próxima</button></nav>}
        <footer data-catalog-count={catalog.length}>
          <span>{catalog.length} produtos neste computador</span>
          {campaign && (
            <>
              <span>{selected.length} selecionados</span>
              <button
                className="offer-primary"
                disabled={!selected.length}
                onClick={() => {
                  onInclude(selected);
                  setSelected([]);
                }}
              >
                Incluir selecionados na campanha <ArrowRight />
              </button>
            </>
          )}
        </footer>
      </div>
      {campaign && available.length === 0 && catalog.length > 0 && (
        <p className="offer-help">
          Todos os produtos visíveis já estão nesta campanha.
        </p>
      )}
    </div>
  );
}

function ProductForm({ initial, onCancel, onSave }) {
  const recovered = useMemo(() => {
    if (initial) return normalizeProductDraft(initial);
    try {
      const draft = JSON.parse(localStorage.getItem(FORM_DRAFT));
      return draft ? normalizeProductDraft(draft) : blankProduct();
    } catch {
      return blankProduct();
    }
  }, [initial]);
  const [product, setProduct] = useState(recovered),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [imageProcessing, setImageProcessing] = useState(false);
  const variants = Array.isArray(product.fragrances)
    ? product.fragrances
    : [];
  useEffect(() => {
    try {
      localStorage.setItem(FORM_DRAFT, JSON.stringify(product));
    } catch {
      setMessage(
        "O rascunho do formulário ficou grande demais para o armazenamento temporário. Salve o produto para gravá-lo no catálogo local.",
      );
    }
  }, [product]);
  const field = (key) => ({
    value: product[key] || "",
    onChange: (e) =>
      setProduct({ ...product, [key]: e.target.value, imageApproved: false }),
  });
  async function submit(e) {
    e.preventDefault();
    if (imageProcessing) {
      setMessage("Aguarde o processamento da imagem terminar antes de salvar.");
      return;
    }
    const issues = productDraftIssues(product);
    if (issues.length) {
      setMessage(issues.join(" · "));
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await onSave(product);
      localStorage.removeItem(FORM_DRAFT);
    } catch (error) {
      setMessage(panelErrorMessage("product-drafts-save", error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="offer-page">
      <button
        className="offer-back"
        onClick={onCancel}
      >
        <ArrowLeft /> Produtos
      </button>
      <header className="offer-page-head">
        <div>
          <h1>{product.revision ? "Editar produto" : "Cadastrar produto"}</h1>
          <p>Produtos / {product.revision ? product.name : "Novo produto"}</p>
        </div>
      </header>
      <div className="offer-warning">
        <CheckCircle2 />
        <strong>
          O preenchimento incompleto é preservado automaticamente neste
          computador.
        </strong>
      </div>
      {message && <div className="offer-error">{message}</div>}
      <form className="offer-product-form" onSubmit={submit}>
        <section>
          <h2>Identificação</h2>
          <div className="offer-form-grid">
            <label className="wide">
              Nome do produto
              <input required maxLength={120} {...field("name")} />
            </label>
            <label>
              Código interno
              <input required maxLength={60} {...field("code")} />
            </label>
            <label>
              Marca
              <input {...field("brand")} />
            </label>
            <label>
              Conteúdo
              <input {...field("content")} />
            </label>
            <label>
              Categoria
              <select {...field("category")}>
                {productCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Identificador
              <select {...field("identifierType")}>
                <option value="gtin">GTIN / código de barras</option>
                <option value="plu">Código interno / PLU</option>
              </select>
            </label>
            {product.identifierType === "gtin" && !variants.length && (
              <label>
                GTIN do produto
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{8}|[0-9]{12,14}"
                  maxLength={14}
                  {...field("barcode")}
                />
              </label>
            )}
            {product.identifierType === "plu" && (
              <label>
                Motivo sem GTIN
                <input required {...field("noGtinReason")} />
              </label>
            )}
            <details className="wide">
              <summary>
                Variantes e códigos de barras
                <small>
                  {variants.length
                    ? ` ${variants.length} cadastrada${variants.length === 1 ? "" : "s"}`
                    : " Opcional"}
                </small>
              </summary>
              {variants.map((f, index) => (
                <div className="offer-variant" key={index}>
                  <label>
                    Variante {index + 1}
                    <input
                      required
                      value={f.name}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          fragrances: p.fragrances.map((item, i) =>
                            i === index
                              ? { ...item, name: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  {product.identifierType === "gtin" && (
                    <label>
                      GTIN
                      <input
                        required
                        inputMode="numeric"
                        pattern="[0-9]{8}|[0-9]{12,14}"
                        value={f.barcode}
                        onChange={(e) =>
                          setProduct((p) => ({
                            ...p,
                            fragrances: p.fragrances.map((item, i) =>
                              i === index
                                ? { ...item, barcode: e.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </label>
                  )}
                  <button
                    type="button"
                    className="offer-secondary"
                    onClick={() =>
                      setProduct((p) => ({
                        ...p,
                        fragrances: p.fragrances.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remover
                  </button>
                </div>
              ))}
              <p className="offer-help">
                Use variantes apenas quando versões do mesmo produto tiverem
                códigos de barras próprios.
              </p>
              <button
                type="button"
                className="offer-secondary"
                disabled={variants.length >= 8}
                onClick={() =>
                  setProduct((p) => ({
                    ...p,
                    barcode: "",
                    fragrances: [...variants, { name: "", barcode: "" }],
                  }))
                }
              >
                Adicionar variante
              </button>
            </details>
          </div>
        </section>
        <section>
          <h2>Foto do produto</h2>
          <label
            className={`offer-file${imageProcessing ? " is-processing" : ""}`}
            data-image-processing={imageProcessing ? "true" : "false"}
            aria-busy={imageProcessing}
          >
            {product.image ? (
              <img src={product.image} alt="Prévia do produto" />
            ) : (
              <ImageIcon size={42} />
            )}
            <strong>
              {imageProcessing ? "Processando imagem…" : "Escolher foto"}
            </strong>
            <small>
              PNG, JPG ou WEBP · até 10 MB; envio otimizado para até 2 MB
            </small>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageProcessing(true);
                  setMessage("");
                  try {
                    const image = await readProductImage(file);
                    setProduct((p) => ({
                      ...p,
                      ...image,
                      imageApproved: false,
                    }));
                  } catch (error) {
                    setMessage(
                      error.message || "Não foi possível processar a imagem.",
                    );
                  } finally {
                    setImageProcessing(false);
                  }
                }
              }}
            />
          </label>
          <label>
            Origem da imagem
            <input
              required
              list="image-source-options"
              placeholder="Selecione ou escreva outra origem"
              {...field("imageSource")}
            />
            <datalist id="image-source-options">
              {IMAGE_SOURCE_OPTIONS.map((source) => (
                <option value={source} key={source} />
              ))}
            </datalist>
            <small>
              Escolha uma opção frequente ou escreva outra origem quando
              necessário.
            </small>
          </label>
          <label className="offer-check">
            <input
              type="checkbox"
              checked={product.imageAuthorized}
              onChange={(e) =>
                setProduct({
                  ...product,
                  imageAuthorized: e.target.checked,
                  imageApproved: false,
                })
              }
            />{" "}
            Tenho autorização de uso
          </label>
          <label className="offer-check">
            <input
              type="checkbox"
              checked={product.imageApproved}
              disabled={
                !product.image ||
                !product.imageAuthorized ||
                !product.imageSource.trim()
              }
              onChange={async (e) => {
                const checked = e.currentTarget.checked;
                if (checked && !await requireSensitiveAction("confirmar a foto do produto")) return;
                setProduct((current) => ({ ...current, imageApproved: checked }));
              }}
            />{" "}
            Conferi a foto deste produto
          </label>
        </section>
        <footer>
          <button
            type="button"
            className="offer-secondary"
            onClick={() => {
              localStorage.removeItem(FORM_DRAFT);
              onCancel();
            }}
          >
            Cancelar
          </button>
          <div>
            <button
              className="offer-primary"
              disabled={busy || imageProcessing}
            >
              {imageProcessing
                ? "Aguardando imagem…"
                : busy
                  ? "Salvando produto…"
                  : "Salvar produto"}
            </button>
            <small>Um único salvamento grava o produto neste computador.</small>
          </div>
        </footer>
      </form>
    </div>
  );
}

const pendingTypes = [
  ["expiry", "Vencimento"],
  ["price", "Preço"],
  ["photo", "Foto"],
  ["identifier", "Código e GTIN"],
  ["unit", "Unidade"],
  ["registration", "Cadastro do produto"],
  ["campaign", "Dados da campanha"],
];
function pendingType(message, hasProduct) {
  const text = message.toLocaleLowerCase("pt-BR");
  if (text.includes("vencimento")) return "expiry";
  if (text.includes("preço")) return "price";
  if (text.includes("foto") || text.includes("imagem")) return "photo";
  if (text.includes("gtin") || text.includes("código de barras"))
    return "identifier";
  if (text.includes("unidade")) return "unit";
  return hasProduct ? "registration" : "campaign";
}
function groupedIssues(campaign, catalog) {
  const products = campaign.items
    .map((item) => catalog.find((product) => product.id === item.productId))
    .filter(Boolean)
    .sort((a, b) => (b.name || "").length - (a.name || "").length);
  const groups = new Map(
    pendingTypes.map(([key, label]) => [
      key,
      { key, label, items: [], products: new Set() },
    ]),
  );
  for (const message of campaignIssues(campaign, catalog)) {
    const product = products.find((item) =>
      message.startsWith(`${item.name}: `),
    );
    const reason = product ? message.slice(product.name.length + 2) : message;
    const group = groups.get(pendingType(reason, Boolean(product)));
    group.items.push({ message: reason, product });
    if (product) group.products.add(product.id);
  }
  return [...groups.values()].filter((group) => group.items.length);
}
function Review({ campaign, catalog, onBack, persist, onFix }) {
  const issues = campaignIssues(campaign, catalog),
    groups = groupedIssues(campaign, catalog),
    [openGroup, setOpenGroup] = useState(groups[0]?.key || "");
  return (
    <div className="offer-page offer-page--review">
      <button className="offer-back" onClick={onBack}>
        <ArrowLeft /> Voltar aos produtos
      </button>
      <header className="offer-campaign-head">
        <div>
          <div>
            <h1>Conferir e publicar</h1>
            <p>
              {campaign.title} · {day(campaign.startDate)} a{" "}
              {day(campaign.endDate)}
            </p>
          </div>
        </div>
        <Steps step={2} />
      </header>
      <div className="offer-review">
        <section>
          <h2>Prévia da campanha no site</h2>
          <ProductPreview campaign={campaignPreview(campaign, catalog)} />
        </section>
        <aside>
          <h2>Checklist da conferência</h2>
          {issues.length ? (
            <>
              <div className="offer-error">
                <TriangleAlert /> {issues.length} pendências impedem a
                publicação.
              </div>
              <div className="pending-groups">
                {groups.map((group) => (
                  <section className="pending-group" key={group.key}>
                    <button
                      type="button"
                      aria-expanded={openGroup === group.key}
                      onClick={() =>
                        setOpenGroup((current) =>
                          current === group.key ? "" : group.key,
                        )
                      }
                    >
                      <span>{group.label}</span>
                      <strong>
                        {group.products.size || group.items.length}
                      </strong>
                      <ChevronRight size={18} />
                    </button>
                    {openGroup === group.key && (
                      <ul>
                        {group.items.map((item, index) => (
                          <li
                            key={`${item.product?.id || "campaign"}-${index}`}
                          >
                            {item.product && (
                              <strong>{item.product.name}</strong>
                            )}
                            <span>{item.message}</span>
                            <button type="button" className="offer-secondary" onClick={() => onFix(group.key, item)}>Corrigir</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className="offer-success">
              <CheckCircle2 /> Fotos, preços, unidades, vencimentos e período
              conferidos.
            </div>
          )}
          <ProductPublication
            campaign={campaign}
            catalog={catalog}
            beforePublish={persist}
            showIssues={false}
          />
        </aside>
      </div>
    </div>
  );
}

function PhotoReview({ products, onBack, onApprove }) {
  const [index, setIndex] = useState(0), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const product = products[index];
  if (!product) return <div className="offer-page"><button className="offer-back" onClick={onBack}><ArrowLeft /> Voltar</button><div className="offer-success"><CheckCircle2 /> Não há imagens pendentes nesta seleção.</div></div>;
  async function approve() {
    setBusy(true);setMessage("");
    try { await onApprove(product.id);setMessage("Imagem conferida e salva neste computador."); }
    catch (error) { setMessage(panelErrorMessage("product-drafts-save", error)); }
    finally { setBusy(false); }
  }
  return <div className="offer-page offer-photo-review">
    <button className="offer-back" onClick={onBack}><ArrowLeft /> Voltar</button>
    <header className="offer-page-head"><div><h1>Conferir imagem</h1><p>Produto {index + 1} de {products.length} · autorização válida por até 10 minutos</p></div></header>
    {message && <div className={product.imageApproved ? "offer-success" : "offer-error"} role="status">{message}</div>}
    <nav className="photo-review-navigation" aria-label="Navegação entre imagens"><button className="offer-secondary" disabled={index === 0 || busy} onClick={() => { setIndex(index - 1);setMessage(""); }}>Imagem anterior</button><span aria-live="polite">Imagem {index + 1} de {products.length}</span><button className="offer-primary" disabled={index === products.length - 1 || !product.imageApproved || busy} onClick={() => { setIndex(index + 1);setMessage(""); }}>Próxima imagem <ArrowRight /></button></nav>
    <section className="photo-review-card">
      <div className="photo-review-image"><img src={product.image} alt={`Foto de ${product.name}`} /></div>
      <div className="photo-review-data"><span className={product.imageApproved ? "offer-badge" : "campaign-photo-status"}>{product.imageApproved ? "Conferida" : "Pendente"}</span><h2>{productDescription(product)}</h2><dl><div><dt>Marca</dt><dd>{product.brand || "Não informada"}</dd></div><div><dt>Código interno</dt><dd>{product.code}</dd></div><div><dt>GTINs</dt><dd>{productBarcodes(product).join(" / ") || "Sem GTIN"}</dd></div><div><dt>Origem</dt><dd>{product.imageSource || "Não informada"}</dd></div></dl>
        {!product.imageApproved && <button className="offer-primary" disabled={busy} onClick={approve}>{busy ? "Salvando…" : "Aprovar esta imagem"}</button>}
      </div>
    </section>
  </div>;
}

export default function OfferCampaignPanel() {
  const { workspace, workspaceRef, replace, persist, loaded, saveState } =
    useLocalWorkspace();
  const [page, setPage] = useState("campaigns"),
    [campaignId, setCampaignId] = useState(null),
    [editing, setEditing] = useState(null),
    [notice, setNotice] = useState(""),
    [focusTarget, setFocusTarget] = useState(null),
    [photoReviewIds, setPhotoReviewIds] = useState([]),
    [photoReviewReturn, setPhotoReviewReturn] = useState("catalog"),
    [photoReviewAuthorizedUntil, setPhotoReviewAuthorizedUntil] = useState(0);
  const campaign = workspace.campaigns.find((c) => c.id === campaignId);
  const updateCampaign = (patch) =>
    replace({
      ...workspaceRef.current,
      campaigns: workspaceRef.current.campaigns.map((c) =>
        c.id === campaignId ? { ...c, ...patch } : c,
      ),
    });
  function open(id) {
    setCampaignId(id);
    setPage("campaign");
  }
  function prepare() {
    const campaigns = prepareNovemberCampaigns(
      workspaceRef.current.campaigns,
      () => crypto.randomUUID(),
    );
    replace({ ...workspaceRef.current, campaigns });
    open(campaigns.find((c) => c.templateKey === "novembro-2026-esquenta").id);
  }
  function addCampaign(startDate = "") {
    const c = { ...blankCampaign(), startDate };
    replace({
      ...workspaceRef.current,
      campaigns: [...workspaceRef.current.campaigns, c],
    });
    open(c.id);
  }
  function include(ids) {
    if (!campaign) return;
    updateCampaign({
      items: [
        ...campaign.items,
        ...ids
          .filter((id) => !campaign.items.some((i) => i.productId === id))
          .map((productId) => ({
            id: crypto.randomUUID(),
            productId,
            priceCents: 0,
            unit: "un",
            expiresOn: "",
            noExpiry: false,
            conditions: "",
          })),
      ],
    });
    setPage("campaign");
  }
  async function saveProduct(input) {
    const codes = productBarcodes(input).map((c) => c.padStart(14, "0"));
    if (
      workspaceRef.current.catalog.some(
        (p) =>
          p.id !== input.id &&
          (p.code === input.code.trim() ||
            productBarcodes(p).some((c) =>
              codes.includes(c.padStart(14, "0")),
            )),
      )
    )
      throw new Error("Código já cadastrado. Confira a identidade.");
    const variants = Array.isArray(input.fragrances)
      ? input.fragrances.map((f) => ({
          name: f.name.trim(),
          barcode: f.barcode.trim(),
        }))
      : [];
    const next = {
      ...input,
      code: input.code.trim(),
      name: input.name.trim(),
      fragrances: variants,
      revision: (input.revision || 0) + 1,
    };
    next.barcode = variants[0]?.barcode || input.barcode?.trim() || "";
    next.variant = next.fragrances
      .map((f) => f.name)
      .filter(Boolean)
      .join(" / ");
    replace({
      ...workspaceRef.current,
      catalog: [
        ...workspaceRef.current.catalog.filter((p) => p.id !== next.id),
        next,
      ],
    });
    await persist();
    setEditing(null);
    setPage("catalog");
    setNotice("Produto salvo neste computador.");
  }
  function move(index, delta) {
    const items = [...campaign.items],
      to = index + delta;
    if (to < 0 || to >= items.length) return;
    [items[index], items[to]] = [items[to], items[index]];
    updateCampaign({ items });
  }
  async function openPhotoReview(product, returnPage = page, campaignOnly = false) {
    if (Date.now() >= photoReviewAuthorizedUntil) {
      const confirmed = await requireSensitiveAction("iniciar a conferência individual das imagens");
      if (!confirmed) return;
      setPhotoReviewAuthorizedUntil(Date.now() + PHOTO_REVIEW_SESSION_MS);
    }
    const current = workspaceRef.current;
    const source = campaignOnly && campaign
      ? campaign.items.map((item) => current.catalog.find((entry) => entry.id === item.productId))
      : current.catalog;
    const pending = source.filter((entry) => entry?.image && !entry.imageApproved);
    const ordered = [product, ...pending].filter((entry, index, entries) => entry?.image && entries.findIndex((candidate) => candidate?.id === entry.id) === index);
    setPhotoReviewIds(ordered.map((entry) => entry.id));
    setPhotoReviewReturn(returnPage);
    setPage("photo-review");
  }
  async function approvePhoto(productId) {
    if (Date.now() >= photoReviewAuthorizedUntil) {
      const confirmed = await requireSensitiveAction("continuar a conferência das imagens");
      if (!confirmed) throw new Error("A conferência não foi autorizada.");
      setPhotoReviewAuthorizedUntil(Date.now() + PHOTO_REVIEW_SESSION_MS);
    }
    const current = workspaceRef.current;
    replace({...current,catalog:current.catalog.map((product)=>product.id===productId?{...product,imageApproved:true,revision:(product.revision||0)+1}:product)});
    await persist();
  }
  function fixIssue(type, item) {
    if (type === "photo" && item.product) return openPhotoReview(item.product, "review", true);
    if (["identifier", "registration"].includes(type) && item.product) { setEditing(item.product);setPage("product");return; }
    const campaignItem = item.product && campaign?.items.find((entry) => entry.productId === item.product.id);
    const field = type === "expiry" ? "expiry" : type === "unit" ? "unit" : "price";
    setFocusTarget(campaignItem ? { itemId: campaignItem.id, field } : null);
    setPage("campaign");
  }
  if (!loaded)
    return (
      <div className="offer-loading" role="status">
        Carregando produtos e campanhas…
      </div>
    );
  return (
    <div className="offer-panel">
      {notice && (
        <div className="offer-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}
      <nav className="offer-local-nav" aria-label="Navegação principal">
        <button
          className={
            page === "campaigns" || page === "campaign" || page === "review"
              ? "active"
              : ""
          }
          onClick={() => setPage("campaigns")}
        >
          <Tag /> Campanhas
        </button>
        <button
          className={page === "calendar" ? "active" : ""}
          onClick={() => setPage("calendar")}
        >
          <CalendarDays /> Calendário
        </button>
        <button
          className={page === "catalog" || page === "product" ? "active" : ""}
          onClick={() => {
            setCampaignId(null);
            setPage("catalog");
          }}
        >
          <Package /> Produtos
        </button>
      </nav>
      {page === "campaigns" && (
        <CampaignList
          workspace={workspace}
          onOpen={open}
          onPrepare={prepare}
          onNew={() => addCampaign()}
          onCatalog={() => {
            setCampaignId(null);
            setPage("catalog");
          }}
        />
      )}
      {page === "calendar" && (
        <CampaignCalendar
          campaigns={workspace.campaigns}
          onOpen={open}
          onNew={addCampaign}
        />
      )}{" "}
      {page === "campaign" && campaign && (
        <CampaignEditor
          campaign={campaign}
          campaigns={workspace.campaigns}
          catalog={workspace.catalog}
          onChange={updateCampaign}
          onCatalog={() => setPage("catalog")}
          onEdit={(p) => {
            setEditing(p);
            setPage("product");
          }}
          onMove={move}
          onReview={() => setPage("review")}
          onBack={() => setPage("campaigns")}
          saveState={saveState}
          onRetry={() => persist().catch(() => {})}
          onReviewPhoto={(product) => openPhotoReview(product, "campaign", true)}
          focusTarget={focusTarget}
          onFocusHandled={() => setFocusTarget(null)}
        />
      )}{" "}
      {page === "catalog" && (
        <Catalog
          catalog={workspace.catalog}
          campaign={campaign}
          onInclude={include}
          onEdit={(p) => {
            setEditing(p);
            setPage("product");
          }}
          onNew={() => {
            setEditing(null);
            setPage("product");
          }}
          onBack={() => setPage(campaign ? "campaign" : "campaigns")}
          onReviewPhoto={(product) => openPhotoReview(product, "catalog")}
        />
      )}{" "}
      {page === "product" && (
        <ProductForm
          initial={editing}
          onCancel={() => setPage("catalog")}
          onSave={saveProduct}
        />
      )}{" "}
      {page === "review" && campaign && (
        <Review
          campaign={campaign}
          catalog={workspace.catalog}
          onBack={() => setPage("campaign")}
          persist={persist}
          onFix={fixIssue}
        />
      )}
      {page === "photo-review" && <PhotoReview products={photoReviewIds.map((id) => workspace.catalog.find((product) => product.id === id)).filter(Boolean)} onBack={() => setPage(photoReviewReturn)} onApprove={approvePhoto} />}
    </div>
  );
}
