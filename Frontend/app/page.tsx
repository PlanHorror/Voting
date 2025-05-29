"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { VoteSessionService } from "@/services/vote-session.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";
import { AuthService } from "@/services/auth.service";

export default function Home() {
  const [activeVotes, setActiveVotes] = useState<VoteSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVotes: 0,
    activeVotes: 0,
    completedVotes: 0,
    totalParticipants: 0,
  });

  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        const voteSessions = await VoteSessionService.getAllVoteSessions();

        // Filter for active votes
        const now = new Date();
        const active = voteSessions.filter((v) => new Date(v.endDate) > now);
        setActiveVotes(active.slice(0, 3)); // Only display up to 3 active votes

        // Calculate stats
        setStats({
          totalVotes: voteSessions.length,
          activeVotes: active.length,
          completedVotes: voteSessions.length - active.length,
          totalParticipants: voteSessions.reduce(
            (sum, v) => sum + (v.voteParticipants?.length || 0),
            0
          ),
        });
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-900 opacity-70"></div>
          <Image
            src="/banner.jpg"
            alt="Vietnam Election"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Digital Voting System
            </h1>
            <p className="text-xl md:text-2xl mb-10">
              A modern, transparent and secure platform for democratic elections
              in Vietnam
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/votes"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors">
                View Active Elections
              </Link>
              <Link
                href="/voting"
                className="bg-transparent hover:bg-blue-600 border-2 border-white px-8 py-3 rounded-md font-medium transition-colors">
                Cast Your Vote
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600">
                {stats.totalVotes}
              </p>
              <p className="text-gray-600 mt-2">Total Elections</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600">
                {stats.activeVotes}
              </p>
              <p className="text-gray-600 mt-2">Active Elections</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600">
                {stats.completedVotes}
              </p>
              <p className="text-gray-600 mt-2">Completed Elections</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600">
                {stats.totalParticipants}
              </p>
              <p className="text-gray-600 mt-2">Total Participants</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Vietnamese Voting Rules */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Vietnam Electoral System
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the principles and rules of voting in Vietnam
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Universal Suffrage
                </h3>
                <p className="text-gray-600">
                  Citizens 18 years or older have the right to vote regardless
                  of ethnicity, gender, social status, beliefs, or residence.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Direct Elections
                </h3>
                <p className="text-gray-600">
                  Voters directly elect representatives to the National Assembly
                  and People&apos;s Councils at all levels.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Equal Voting Rights
                </h3>
                <p className="text-gray-600">
                  Each citizen has one vote of equal value in any election,
                  following the principle of &ldquo;one person, one vote.&rdquo;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Secret Ballots
                </h3>
                <p className="text-gray-600">
                  Voting is conducted by secret ballot to ensure voters can
                  express their choices freely without pressure or influence.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/banner.jpg"
                alt="Vietnam Election Process"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  Modernizing Democracy
                </h3>
                <p className="text-white/90">
                  Our digital voting system preserves traditional values while
                  bringing security and accessibility to Vietnam&apos;s
                  democratic process.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Active Elections */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Active Elections
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Current voting opportunities available for eligible citizens
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeVotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeVotes.map((vote) => (
                <motion.div
                  key={vote.id}
                  variants={fadeInUp}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="h-40 relative">
                    <Image
                      src="/banner.jpg"
                      alt={vote.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute top-0 right-0 m-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {vote.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {vote.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        Ends: {new Date(vote.endDate).toLocaleDateString()}
                      </span>
                      <span>{vote.candidates?.length || 0} Candidates</span>
                    </div>
                    <Link
                      href={`/votes/${vote.id}`}
                      className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No active elections at the moment.
              </p>
            </div>
          )}

          {activeVotes.length > 0 && (
            <motion.div variants={fadeInUp} className="text-center mt-10">
              <Link
                href="/votes"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                View all elections
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How to Vote
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Secure, simple, and accessible voting in just a few steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                1. Register
              </h3>
              <p className="text-gray-600">
                Create an account using your citizen ID and verify your identity
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                2. Get Voting Key
              </h3>
              <p className="text-gray-600">
                Receive a unique voting key for the election you wish to
                participate in
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                3. Cast Your Vote
              </h3>
              <p className="text-gray-600">
                Select your candidate and submit your vote securely using your
                key
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                4. View Results
              </h3>
              <p className="text-gray-600">
                Check the election results after voting has closed
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="mt-12 flex justify-center">
            <Link
              href="/votes"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition-colors">
              Participate Now
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-white py-16">
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Security & Transparency
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our voting system implements advanced security measures to ensure
              a fair and transparent electoral process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600">
                All votes are encrypted from the moment they&apos;re cast until
                they&apos;re counted, ensuring privacy and preventing tampering.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Multiple Verification Layers
              </h3>
              <p className="text-gray-600">
                Supervisors and signers verify the integrity of the voting
                process, ensuring multiple layers of oversight.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Transparent Audit Trail
              </h3>
              <p className="text-gray-600">
                All voting actions are logged with timestamps for complete
                transparency, while maintaining voter anonymity.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Access For Different Users */}
      {isAuthenticated ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-indigo-700 to-blue-700 py-12 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-6">
              Continue to Your Dashboard
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {userRole === "SUPERVISOR" ? (
                <Link
                  href="/supervisor"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors">
                  Supervisor Dashboard
                </Link>
              ) : userRole === "SIGNER" ? (
                <Link
                  href="/signer"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors">
                  Signer Dashboard
                </Link>
              ) : (
                <Link
                  href="/votes"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors">
                  Browse Vote Sessions
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-indigo-700 to-blue-700 py-12 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Participate?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join our secure digital voting platform today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-transparent hover:bg-blue-600 border-2 border-white px-8 py-3 rounded-md font-medium transition-colors">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our voting platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Who can vote in Vietnam&apos;s elections?
              </h3>
              <p className="text-gray-600">
                All Vietnamese citizens aged 18 and above have the right to
                vote, regardless of ethnicity, gender, social status, beliefs,
                or residence.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                How is my vote kept secure and private?
              </h3>
              <p className="text-gray-600">
                Our system uses end-to-end encryption, and your vote is
                anonymous. The system only records that you voted, not what your
                choice was.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                What do I need to vote online?
              </h3>
              <p className="text-gray-600">
                You need an account verified with your citizen ID, and a voting
                key that you&apos;ll receive for each specific election
                you&apos;re eligible to participate in.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                What are Signers and Supervisors?
              </h3>
              <p className="text-gray-600">
                Signers verify and authenticate vote sessions, while Supervisors
                manage the overall election process, ensuring transparency and
                security.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                When can I view election results?
              </h3>
              <p className="text-gray-600">
                Results are automatically published after the voting period ends
                and all votes have been verified by the system.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Can I change my vote after submitting?
              </h3>
              <p className="text-gray-600">
                No, once your vote is submitted, it cannot be changed to
                maintain the integrity of the election process.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Digital Voting System</h3>
              <p className="text-gray-400">
                A secure and transparent platform for modern democratic
                elections in Vietnam.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/votes"
                    className="text-gray-400 hover:text-white transition-colors">
                    Active Elections
                  </Link>
                </li>
                <li>
                  <Link
                    href="/voting"
                    className="text-gray-400 hover:text-white transition-colors">
                    Cast Vote
                  </Link>
                </li>
                <li>
                  <Link
                    href="/result"
                    className="text-gray-400 hover:text-white transition-colors">
                    Results
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Digital Voting System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
