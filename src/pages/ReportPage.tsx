import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { createIncident } from "../services/incidentService";
import { CATEGORIES } from "../types/incident";
import { incidentSchema, type IncidentFormValues } from "../lib/validation";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

export default function ReportPage() {
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<IncidentFormValues>({ resolver: zodResolver(incidentSchema), defaultValues: { category: "Fire Emergency", peopleAffected: 0, contactInfo: "", latitude: undefined, longitude: undefined } });
  const category = watch("category");

  async function submit(values: IncidentFormValues) {
    setSubmitError("");
    try { const id = await createIncident(values); setReference(id); reset(); }
    catch (error) { setSubmitError(error instanceof Error ? error.message : t("report.submitError")); }
  }

  if (reference) return <main className="report-page"><section className="success-card"><CheckCircle2 size={54} /><p className="eyebrow">{t("report.successEyebrow")}</p><h1>{t("report.successTitle")}</h1><p>{t("report.successDescription")}</p><strong className="reference">{reference}</strong><button className="button primary" onClick={() => setReference(null)}>{t("report.submitAnother")}</button></section></main>;

  return <main className="report-page"><header className="public-header"><Link to="/report" className="brand brand-dark"><ShieldAlert size={25} /><div><strong>{t("app.name")}</strong><span>{t("app.emergencyResponse")}</span></div></Link><div className="public-actions"><LanguageSelector /><Link to="/admin/login" className="text-link">{t("auth.signIn")}</Link></div></header>
    <section className="report-intro"><p className="eyebrow">{t("report.eyebrow")}</p><h1>{t("report.title")}</h1><p>{t("report.description")}</p></section>
    <form className="report-form" onSubmit={handleSubmit(submit)}><div className="form-section"><h2>{t("report.what")}</h2>
      <label>{t("report.category")} <span className="required">*</span><div className="category-grid">{CATEGORIES.map((item) => <button type="button" key={item} className={category === item ? "category-card selected" : "category-card"} onClick={() => setValue("category", item, { shouldValidate: true })}>{t(`category.${item}`)}</button>)}</div>{errors.category && <span className="field-error">{errors.category.message}</span>}</label>
      <label>{t("report.titleField")} <span className="required">*</span><input placeholder={t("report.titlePlaceholder")} {...register("title")} />{errors.title && <span className="field-error">{errors.title.message}</span>}</label>
      <label>{t("report.descriptionField")} <span className="required">*</span><textarea rows={5} placeholder={t("report.descriptionPlaceholder")} {...register("description")} />{errors.description && <span className="field-error">{errors.description.message}</span>}</label>
    </div><div className="form-section"><h2>{t("report.where")}</h2><div className="form-grid">
      <label>{t("report.location")} <span className="required">*</span><input placeholder={t("report.locationPlaceholder")} {...register("location")} />{errors.location && <span className="field-error">{errors.location.message}</span>}</label>
      <label>{t("report.people")} <span className="required">*</span><input type="number" min="0" {...register("peopleAffected", { valueAsNumber: true })} />{errors.peopleAffected && <span className="field-error">{errors.peopleAffected.message}</span>}</label>
    </div><label>{t("report.contact")} <span className="optional">({t("report.optional")})</span><input placeholder={t("report.contact")} {...register("contactInfo")} />{errors.contactInfo && <span className="field-error">{errors.contactInfo.message}</span>}</label><div className="form-grid"><label>{t("report.latitude")} <span className="optional">({t("report.coordinatesOptional")})</span><input type="number" step="any" placeholder="13.0827" {...register("latitude", { valueAsNumber: true })} />{errors.latitude && <span className="field-error">{t("report.invalidLatitude")}</span>}</label><label>{t("report.longitude")} <span className="optional">({t("report.coordinatesOptional")})</span><input type="number" step="any" placeholder="80.2707" {...register("longitude", { valueAsNumber: true })} />{errors.longitude && <span className="field-error">{t("report.invalidLongitude")}</span>}</label></div></div>
    {submitError && <div className="alert error" role="alert"><AlertTriangle size={17} />{submitError}</div>}<div className="form-actions"><p>{t("report.classificationNotice")}</p><button className="button primary" disabled={isSubmitting}>{isSubmitting ? t("report.submitting") : t("report.submit")}</button></div></form>
  </main>;
}
