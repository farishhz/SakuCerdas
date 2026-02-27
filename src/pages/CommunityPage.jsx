import { useState } from 'react';
import Modal from '../components/Modal';

export default function CommunityPage() {
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="container page">
      <section className="card">
        <h1>About + Community</h1>
        <p className="muted">Connect with people, events, and opportunities that accelerate your future readiness.</p>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Community</h2>
          <ul className="clean-list">
            <li>Peer learning circle (weekly)</li>
            <li>Career clinic & portfolio review</li>
            <li>HR and policy roundtable</li>
          </ul>
        </article>

        <article className="card">
          <h2>Event Calendar</h2>
          <ul className="clean-list">
            <li>Mar 5 · AI Literacy Sprint Kickoff</li>
            <li>Mar 12 · Green Jobs Outlook Forum</li>
            <li>Mar 20 · Skills-Based Hiring Workshop</li>
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Newsletter</h2>
        <p className="muted">Weekly insight, trend signal, and practical action plan.</p>
        <div className="newsletter-row">
          <input
            className="text-input"
            placeholder="email@domain.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button className="btn-primary" onClick={() => setOpenModal(true)}>Subscribe</button>
        </div>
      </section>

      <Modal open={openModal} title="Newsletter Subscription" onClose={() => setOpenModal(false)}>
        <p className="muted">
          {email ? `Terima kasih! ${email} sudah terdaftar untuk update mingguan.` : 'Masukkan email terlebih dahulu untuk berlangganan.'}
        </p>
      </Modal>
    </div>
  );
}
