/**
 * Challenges List
 *
 * Shows all the challenges.
 */
import React from "react";
import PT from "prop-types";
import moment from 'moment'
import cn from "classnames";
import {phaseEndDate, getLastDate } from '../../../../utils/date'
import Files from "../../../../assets/images/files.svg";
import User from "../../../../assets/images/iconregistrant.svg";
import UserMobile from "../../../../assets/images/user.svg";
import { Link } from "@reach/router";
import "./styles.module.scss";


const STALLED_MSG = 'Stalled'
const DRAFT_MSG = 'In Draft'
const STALLED_TIME_LEFT_MSG = 'Challenge is currently on hold'
const FF_TIME_LEFT_MSG = 'Winner is working on fixes'
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Format the remaining time of a challenge phase
 * @param phase Challenge phase
 * @returns {*}
 */
const getTimeLeft = (phase) => {
  if (!phase) return STALLED_TIME_LEFT_MSG
  if (phase.name === 'Final Fix') {
    return FF_TIME_LEFT_MSG
  }

  let time = moment(phaseEndDate(phase)).diff();
  const late = time < 0;
  if (late) time = -time;

  let format;
  if (time > DAY_MS) format = 'D[d] H[h]';
  else if (time > HOUR_MS) format = 'H[h] m[min]';
  else format = 'm[min] s[s]';

  time = moment.duration(time).format(format);
  time = late ? `Late by ${time}` : `${time} to go`;
  return time;
  // let time = moment(phase.scheduledEndTime).diff()
  // const late = time < 0
  // if (late) time = -time
  // const duration = getFormattedDuration(time)
  // return late ? `Late by ${duration}` : `${duration} to go`
}

/**
 * Find current phase and remaining time of it
 * @param c Challenge
 * @returns {{phaseMessage: string, endTime: {late, text}}}
 */
const getPhaseInfo = (c) => {
  const { phases, currentPhaseNames, type, status } = c
  const currentPhases = _.map(currentPhaseNames, (name)=> {
    return _.find(phases, (p) => p.name === name)
  })
  const checkPhases = (currentPhases && currentPhases.length > 0 ? currentPhases : phases)
  let statusPhase = checkPhases
    .filter(p => p.name !== 'Registration' && p.isOpen)
    .sort((a, b) => moment(a.scheduledEndTime).diff(b.scheduledEndTime))[0]

  if (!statusPhase && type === 'First2Finish' && checkPhases.length) {
    try {
      statusPhase = Object.clone(checkPhases[0])
      statusPhase.name = 'Submission'
    } catch (e) {}
  }
  let phaseMessage = STALLED_MSG
  if (statusPhase) phaseMessage = statusPhase.name
  else if (status === 'DRAFT') phaseMessage = DRAFT_MSG

  const endTime = getTimeLeft(statusPhase)
  return { phaseMessage, endTime }
}


const ChallengesList = ({ challenges }) => {
  const logoStyleName = {
    Design: "logo-design",
    Development: "logo-dev",
    Data: "logo-data",
    QA: "logo-qa",
  };

  return (
    <div styleName="challenge-list-container">
      {!!challenges &&
        challenges.map((challenge) =>{ 
          if (!logoStyleName[challenge.track]) {
           challenge.track ='QA'
            
            debugger;
          }
          return <div key={challenge.id} styleName="challenge-list-row">
            <div styleName="challenge-title">
              <span
                styleName={cn(
                  "challenge-logo",
                  `${logoStyleName[challenge.track] ||'logo-qa'}`
                )}
              >
                <div styleName="logo-upper">
                  <div>CH</div>
                </div>
                <div styleName="logo-lower">
                  <div>TCO</div>
                </div>
              </span>
              <div styleName="challenge-body">
                <div styleName="title-deadline-wrapper">
                  <Link
                    to={`/submissions/mychallenges/${challenge.id}`}
                    styleName="challenge-title"
                  >
                    {challenge.name}
                  </Link>
                  <div styleName="challenge-deadline">{getPhaseInfo(challenge).endTime}</div>
                </div>
                <div styleName="challenge-count">
                  <div styleName="register-count-wrapper">
                    <User styleName="user-icon" />
                    <div>{challenge.numOfRegistrants}</div>
                  </div>
                  <div styleName="submissions-count-wrapper">
                    <Files styleName="files-icon" />
                    <div>{challenge.numOfSubmissions}</div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName="challenge-role">
              <p styleName="role-label">My Role</p>
              <div styleName="role-value">{challenge.role}</div>
            </div>
            <div styleName="challenge-phase">
              <p styleName="phase-label">Phase</p>
              <div styleName="phase-value">{getPhaseInfo(challenge).phaseMessage}</div>
            </div>

            <div styleName="mobile-challenge-logo">
              <span
                styleName={cn(
                  "challenge-logo",
                  `${logoStyleName[challenge.track]}`
                )}
              >
                <div styleName="logo-upper">
                  <div>CH</div>
                </div>
                <div styleName="logo-lower">
                  <div>TCO</div>
                </div>
              </span>
            </div>

            <div styleName="mobile-challenge-body">
              <div styleName="mobile-challenge-title">
                <Link
                  to={`/submissions/mychallenges/${challenge.id}`}
                  styleName="mobile-challenge-title-text"
                >
                  {challenge.title}
                </Link>
                <div styleName="challenge-deadline">{challenge.deadline}</div>
              </div>

              <div styleName="mobile-role-phase-wrapper">
                <div styleName="challenge-role">
                  <div styleName="role-label">My Role</div>
                  <div styleName="role-value">{challenge.role}</div>
                </div>
                <div styleName="challenge-phase">
                  <div styleName="phase-label">Phase</div>
                  <div styleName="phase-value">{challenge.phase}</div>
                </div>
              </div>

              <div styleName="mobile-stats-wrapper">
                <div styleName="register-count-wrapper">
                  <UserMobile styleName="user-icon" />
                  <div>{challenge.registers}</div>
                </div>
                <div styleName="submissions-count-wrapper">
                  <Files styleName="files-icon" />
                  <div>{challenge.submitters}</div>
                </div>
              </div>
            </div>
          </div>
          })}

      <div styleName="bottom-challenge-message">
        Don't see a challenge you're looking for? It will appear once you upload
        a submission
      </div>
    </div>
  );
};

ChallengesList.propTypes = {
  challenges: PT.object,
};

export default ChallengesList;
