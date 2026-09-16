// @ts-nocheck
"use client";

const sharedSvgProps = {
  className: 'enterprise-illustration',
  fill: 'none',
  focusable: 'false',
  preserveAspectRatio: 'xMinYMid meet',
}

function Illustration({ type, viewBox, children }) {
  return (
    <svg {...sharedSvgProps} className={`enterprise-illustration enterprise-illustration--${type}`} viewBox={viewBox}>
      <g className="enterprise-illustration-base" stroke="var(--mist-white-700)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

function CustomLimitsIllustration() {
  return (
    <Illustration type="limits" viewBox="48 38 234 244">
      <circle className="enterprise-draw" cx="160" cy="160" r="112" />
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--limits">
        <circle className="enterprise-dash" cx="160" cy="160" r="78" strokeDasharray="7 5" />
        <g className="enterprise-node-group">
          <circle className="enterprise-node enterprise-signal-node" cx="160" cy="82" r="8" />
          <circle className="enterprise-node enterprise-signal-node" cx="92.45" cy="199" r="8" />
          <circle className="enterprise-node enterprise-signal-node" cx="227.55" cy="199" r="8" />
        </g>
      </g>
      <circle className="enterprise-draw enterprise-draw--late" cx="160" cy="160" r="44" />
      <circle className="enterprise-draw enterprise-draw--later enterprise-node enterprise-hover-accent" cx="160" cy="160" r="10" />
    </Illustration>
  )
}

function PriorityProcessingIllustration() {
  return (
    <Illustration type="priority" viewBox="48 37 234 276">
      <g className="enterprise-priority-core-motion enterprise-hover-accent">
        <path className="enterprise-draw enterprise-priority-core" d="M160 85 220 120 160 155 100 120 160 85ZM100 120v70l60 35 60-35v-70M160 155v70" />
      </g>
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--priority">
        <g className="enterprise-priority-satellite enterprise-priority-satellite--first"><path className="enterprise-draw enterprise-draw--late" d="M72 47 96 61 72 75 48 61 72 47ZM48 61v28l24 14 24-14V61M72 75v28" /></g>
        <g className="enterprise-priority-satellite enterprise-priority-satellite--second"><path className="enterprise-draw enterprise-draw--late" d="m248 47 24 14-24 14-24-14 24-14ZM224 61v28l24 14 24-14V61M248 75v28" /></g>
        <g className="enterprise-priority-satellite enterprise-priority-satellite--third"><path className="enterprise-draw enterprise-draw--later" d="m160 247 24 14-24 14-24-14 24-14ZM136 261v28l24 14 24-14v-28M160 275v28" /></g>
        <path className="enterprise-dash" d="m96 91 23 14M224 91l-23 14M160 225v22" strokeDasharray="7 5" />
      </g>
    </Illustration>
  )
}

function DeploymentOptionsIllustration() {
  return (
    <Illustration type="deployment" viewBox="49 25 232 270">
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--deployment">
        <path className="enterprise-dash" d="m160 35 111 64v122l-111 64L49 221V99L160 35Z" strokeDasharray="7 5" />
      </g>
      <path className="enterprise-draw enterprise-deployment-frame enterprise-hover-accent" d="m160 52 96 55v106l-96 55-96-55V107l96-55Z" />
      <g className="enterprise-deployment-layer-motion enterprise-deployment-layer-motion--top"><path className="enterprise-draw enterprise-deployment-layer" d="m160 85 64 37-64 37-64-37 64-37Z" /></g>
      <g className="enterprise-deployment-layer-motion enterprise-deployment-layer-motion--middle"><path className="enterprise-draw enterprise-draw--late enterprise-deployment-layer" d="m160 123 64 37-64 37-64-37 64-37Z" /></g>
      <g className="enterprise-deployment-layer-motion enterprise-deployment-layer-motion--bottom"><path className="enterprise-draw enterprise-draw--later enterprise-deployment-layer" d="m160 161 64 37-64 37-64-37 64-37Z" /></g>
    </Illustration>
  )
}

function SupportRequirementsIllustration() {
  return (
    <Illustration type="support" viewBox="38 68 252 212">
      <g className="enterprise-support-circle-motion enterprise-support-circle-motion--left enterprise-hover-accent"><circle className="enterprise-draw" cx="112" cy="140" r="62" /></g>
      <g className="enterprise-support-circle-motion enterprise-support-circle-motion--right enterprise-hover-accent"><circle className="enterprise-draw enterprise-draw--late" cx="208" cy="140" r="62" /></g>
      <circle className="enterprise-draw enterprise-draw--later enterprise-node" cx="160" cy="140" r="10" />
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--support">
        <path className="enterprise-dash" d="M48 205c27 43 65 65 112 65s85-22 112-65" strokeDasharray="7 5" />
        <circle className="enterprise-node" cx="46" cy="202" r="8" />
        <circle className="enterprise-node" cx="274" cy="202" r="8" />
      </g>
    </Illustration>
  )
}

function SlaRequirementsIllustration() {
  return (
    <Illustration type="sla" viewBox="43 33 244 254">
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--sla">
        <circle className="enterprise-dash" cx="160" cy="160" r="117" strokeDasharray="7 5" />
        <g className="enterprise-node-group">
          <circle className="enterprise-node enterprise-signal-node" cx="160" cy="43" r="8" />
          <circle className="enterprise-node enterprise-signal-node" cx="59" cy="219" r="8" />
          <circle className="enterprise-node enterprise-signal-node" cx="261" cy="219" r="8" />
        </g>
      </g>
      <g className="enterprise-sla-core-motion enterprise-hover-accent">
        <path className="enterprise-draw enterprise-sla-core" d="m160 85 67 39-67 39-67-39 67-39ZM93 124v78l67 39 67-39v-78M160 163v78" />
      </g>
    </Illustration>
  )
}

function CommercialTermsIllustration() {
  return (
    <Illustration type="commercial" viewBox="42 47 258 204">
      <g className="enterprise-commercial-tower-motion enterprise-hover-accent">
        <ellipse className="enterprise-draw" cx="120" cy="88" rx="78" ry="31" />
        <path className="enterprise-draw enterprise-draw--late" d="M42 88v122c0 17 35 31 78 31s78-14 78-31V88" />
        <path className="enterprise-draw enterprise-draw--late enterprise-commercial-separators" d="M42 130c0 17 35 31 78 31s78-14 78-31M42 171c0 17 35 31 78 31s78-14 78-31" />
      </g>
      <g className="enterprise-hover enterprise-hover--flow enterprise-hover--commercial">
        <ellipse className="enterprise-dash" cx="250" cy="163" rx="40" ry="18" strokeDasharray="7 5" />
        <path className="enterprise-dash" d="M210 163v48c0 10 18 18 40 18s40-8 40-18v-48" strokeDasharray="7 5" />
      </g>
    </Illustration>
  )
}

const illustrations = {
  limits: CustomLimitsIllustration,
  priority: PriorityProcessingIllustration,
  deployment: DeploymentOptionsIllustration,
  support: SupportRequirementsIllustration,
  sla: SlaRequirementsIllustration,
  commercial: CommercialTermsIllustration,
}

export function EnterpriseIllustration({ type }) {
  const Component = illustrations[type]
  return Component ? <Component /> : null
}
