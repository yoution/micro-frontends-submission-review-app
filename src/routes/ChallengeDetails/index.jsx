/**
 * ChallengeDetails
 *
 * Page for the Details of Challenges.
 */
import React from "react";
import ordinal from "ordinal"
import moment from 'moment'
import LayoutContainer from "../../components/LayoutContainer";
import ChallengeDetailsHeader from "./components/ChallengeDetailsHeader";
import ChallengeProgress from "./components/ChallengeProgress";
import { useData } from "../../hooks/useData";
import { getMyChallengeById, getSubmissions } from "../../services/challenges";
import SubmissionDetails from "./components/SubmissionDetails";
import challengesById from "../../../local/mock-server/data/challengesById.json";

const getPurse = (challenge) => {
  const prizeSet = _.find(challenge.prizeSets, p=> p.type === 'placement')
  return _.map(prizeSet.prizes, (p, index)=> {
    return {
      money: '$' +p.value,
      position:  ordinal(index + 1)
    }
  })
}

const isStarted = (allPhases, phase, index) => {
  if (index === 0 && phase.isOpen) {
    return true
  }
  if (index < allPhases.length -1 && allPhases[index+1].isOpen ) {
    return true;
  }
  return false
}


const getProgress = (challenge) => {
  const progress = {}
  progress.progressBar = _.map(challenge.phases, (p, index)=> {
    return {
      name: p.name,
      completed: isStarted(challenge.phases, p, index),
      deadline: moment(p.actualEndDate).format('MMM DD,HH:mm')
    }
  })
  progress.progressPercent = 80
  progress.currentPhase = challenge.currentPhaseNames
  return progress 
}
const ChallengeDetails = ({ challengeId }) => {

  const [challenge, loadingError] = useData(getMyChallengeById, challengeId);
  const [submissions, loadingSubmissionsError] = useData(getSubmissions, challengeId);

  return (
    <LayoutContainer>
      {!!challenge && (
        <ChallengeDetailsHeader
          title={challenge.name}
          tags={challenge.tags}
          role={challenge.role}
          backTo="/submissions"
        />
      )}
      {!!challenge && (
        <ChallengeProgress
          progress={getProgress(challenge)}
          purse={getPurse(challenge)}
          challengeId={challengeId}
          registers={challenge.numOfRegistrants}
          submitters={challenge.numOfSubmissions}
        />
      )}
      {challenge && (
        <SubmissionDetails
          type={challenge.track}
          role={challenge.role}
          submissionCompleted={challenge.submissionCompleted}
          submissions={submissions}
        />
      )}
    </LayoutContainer>
  );
};

export default ChallengeDetails;
