<?php
/**
 * Freeform for Craft CMS.
 *
 * @author        Solspace, Inc.
 * @copyright     Copyright (c) 2008-2022, Solspace, Inc.
 *
 * @see           https://docs.solspace.com/craft/freeform
 *
 * @license       https://docs.solspace.com/license-agreement
 */

namespace Solspace\Freeform\controllers\api;

use Solspace\Freeform\controllers\BaseApiController;
use Solspace\Freeform\Library\DataObjects\FreeformFeed\Notification;
use Solspace\Freeform\Services\FreeformFeedService;
use Solspace\Freeform\Services\LoggerService;

class NoticesController extends BaseApiController
{
    public function __construct(
        $id,
        $module,
        $config,
        private FreeformFeedService $feedService,
        private LoggerService $loggerService,
    ) {
        parent::__construct($id, $module, $config ?? []);
    }

    protected function get(): array|object
    {
        $messages = $this->feedService->getUnreadFeedMessages();

        $notices = [];
        foreach ($messages as $message) {
            $data = $message->toArray();
            $data['conditions'] = json_decode($data['conditions'], true);

            $notices[] = new Notification($data);
        }

        return [
            'notices' => $notices,
            'errors' => $this->loggerService->getLogReader()->count(),
        ];
    }

    protected function delete(int $id): bool|null
    {
        return $this->feedService->markFeedMessageAsRead($id);
    }
}
